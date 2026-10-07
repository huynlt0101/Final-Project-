import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.js';

const parseDurationToMs = (value) => {
  const match = /^([0-9]+)([smhd])$/.exec(String(value).toLowerCase());

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2];

  const conversions = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * (conversions[unit] || conversions.d);
};

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const generateAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role?.name || user.role_name || 'user',
      type: 'access'
    },
    authConfig.jwt.accessSecret,
    { expiresIn: authConfig.jwt.accessExpiresIn }
  );

export const generateRefreshToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      type: 'refresh'
    },
    authConfig.jwt.refreshSecret,
    { expiresIn: authConfig.jwt.refreshExpiresIn }
  );

export const verifyToken = (token, type = 'access') => {
  const secret = type === 'refresh' ? authConfig.jwt.refreshSecret : authConfig.jwt.accessSecret;
  return jwt.verify(token, secret);
};

export const getRefreshTokenExpiry = () => new Date(Date.now() + parseDurationToMs(authConfig.jwt.refreshExpiresIn));

export const getAccessTokenExpiry = () => new Date(Date.now() + parseDurationToMs(authConfig.jwt.accessExpiresIn));
