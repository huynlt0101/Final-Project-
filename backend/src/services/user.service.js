import bcrypt from 'bcryptjs';
import { User, Order } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';

export const listUsers = async () => {
  return User.findAll({
    attributes: { exclude: ['password'] },
    include: [{ association: 'role', attributes: ['id', 'name'] }],
    order: [['id', 'ASC']]
  });
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ association: 'role', attributes: ['id', 'name'] }]
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

export const createUser = async (payload) => {
  const passwordHash = await bcrypt.hash(payload.password, 12);

  const user = await User.create({
    username: payload.username,
    email: payload.email,
    password: passwordHash,
    role_id: payload.role_id || null,
    department_id: payload.department_id || null,
    is_active: payload.is_active !== undefined ? payload.is_active : true,
   
    address: payload.address || null,
    phone_number: payload.phone_number || null
  });

  return getUserById(user.id);
};

export const updateUser = async (id, payload) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const updates = {
    username: payload.username ?? user.username,
    email: payload.email ?? user.email,
    role_id: payload.role_id !== undefined ? payload.role_id : user.role_id,
    department_id: payload.department_id !== undefined ? payload.department_id : user.department_id,
    is_active: payload.is_active !== undefined ? payload.is_active : user.is_active,
  
    address: payload.address !== undefined ? payload.address : user.address,
    phone_number: payload.phone_number !== undefined ? payload.phone_number : user.phone_number
  };

  if (payload.password) {
    updates.password = await bcrypt.hash(payload.password, 12);
  }

  await user.update(updates);

  return getUserById(id);
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const orderCount = await Order.count({ where: { user_id: id } });

  if (orderCount > 0) {
    throw new AppError(409, 'Cannot delete user that still has orders');
  }

  await user.destroy();
  return { id: Number(id) };
};
