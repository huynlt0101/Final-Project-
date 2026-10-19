import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User, Role, RefreshToken } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';
import { generateAccessToken, generateRefreshToken, hashToken, verifyToken, getRefreshTokenExpiry } from './token.service.js';

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const normalizeUsername = (value) => String(value || '').trim();

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role?.name || user.role_name || 'user',
  is_active: user.is_active,
  department_id: user.department_id || null
});

const ensureDefaultRole = async (roleName = 'user') => {
  const existingRole = await Role.findOne({ where: { name: roleName } });

  if (existingRole) {
    return existingRole;
  }

  return Role.create({
    name: roleName,
    description: `${roleName.charAt(0).toUpperCase()}${roleName.slice(1)} role`,
    is_active: true
  });
};

const persistRefreshToken = async (userId, refreshToken, existingTokenHash = null) => {
  const tokenHash = hashToken(refreshToken);

  if (existingTokenHash) {
    await RefreshToken.update(
      { revoked_at: new Date() },
      { where: { user_id: userId, token_hash: existingTokenHash } }
    );
  }

  await RefreshToken.create({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: getRefreshTokenExpiry(),
    revoked_at: null
  });

  return tokenHash;
};

const revokeRefreshTokens = async (userId, refreshToken = null) => {
  const payload = { revoked_at: new Date() };
  const where = { user_id: userId };

  if (refreshToken) {
    where.token_hash = hashToken(refreshToken);
  }

  await RefreshToken.update(payload, { where });
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};

export const registerUser = async ({ username, email, password }) => {
  const safeUsername = normalizeUsername(username);
  const safeEmail = normalizeEmail(email);

  if (!safeUsername || safeUsername.length < 3) {
    throw new AppError(400, 'Username must be at least 3 characters long');
  }

  if (!/^[a-zA-Z0-9_-]{3,30}$/.test(safeUsername)) {
    throw new AppError(400, 'Username contains invalid characters');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
    throw new AppError(422, 'Invalid email format');
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password || '')) {
    throw new AppError(422, 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character');
  }

  const existingEmail = await User.findOne({ where: { email: safeEmail } });
  if (existingEmail) {
    throw new AppError(409, 'Email already exists');
  }

  const existingUsername = await User.findOne({ where: { username: safeUsername } });
  if (existingUsername) {
    throw new AppError(409, 'Username already exists');
  }

  const role = await ensureDefaultRole('user');
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    username: safeUsername,
    email: safeEmail,
    password: passwordHash,
    role_id: role.id,
    department_id: null,
    is_active: true
  });

  const userWithRole = await User.findByPk(user.id, {
    include: [{ association: 'role' }]
  });

  const accessToken = generateAccessToken(userWithRole);
  const refreshToken = generateRefreshToken(userWithRole);

  await persistRefreshToken(user.id, refreshToken);

  return {
    user: sanitizeUser(userWithRole),
    accessToken,
    refreshToken,
    setCookies: setAuthCookies
  };
};

export const loginUser = async ({ email, password }, res) => {
  const safeEmail = normalizeEmail(email);

  if (!safeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
    throw new AppError(422, 'Invalid email format');
  }

  const user = await User.findOne({
    where: { email: safeEmail },
    include: [{ association: 'role' }]
  });

  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    throw new AppError(401, 'Invalid credentials');
  }

  if (!user.is_active) {
    throw new AppError(403, 'Account is inactive');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await persistRefreshToken(user.id, refreshToken);

  setAuthCookies(res, accessToken, refreshToken);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken
  };
};

export const logoutUser = async (userId, refreshToken, res) => {
  await revokeRefreshTokens(userId, refreshToken || null);
  clearAuthCookies(res);
  return { success: true };
};

export const refreshUserSession = async (token, res) => {
  if (!token) {
    throw new AppError(401, 'Authentication required');
  }

  const payload = verifyToken(token, 'refresh');
  const refreshTokenRecord = await RefreshToken.findOne({
    where: {
      user_id: payload.sub,
      revoked_at: null,
      expires_at: { [Op.gt]: new Date() }
    }
  });

  if (!refreshTokenRecord) {
    throw new AppError(401, 'Refresh token has expired or been revoked');
  }

  const storedHash = hashToken(token);

  if (refreshTokenRecord.token_hash !== storedHash) {
    throw new AppError(401, 'Invalid refresh token');
  }

  const user = await User.findByPk(payload.sub, { include: [{ association: 'role' }] });
  if (!user || !user.is_active) {
    throw new AppError(401, 'Authentication required');
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  await persistRefreshToken(user.id, newRefreshToken, refreshTokenRecord.token_hash);
  setAuthCookies(res, accessToken, newRefreshToken);

  return {
    accessToken,
    refreshToken: newRefreshToken
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [{ association: 'role' }]
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return sanitizeUser(user);
};

export const getAuthState = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [{ association: 'role' }]
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return sanitizeUser(user);
};

export const findUserById = async (userId) => User.findByPk(userId, { include: [{ association: 'role' }] });
