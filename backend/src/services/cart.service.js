import { sequelize, Cart, CartItem } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';
import {
  cartIncludes,
  formatCart,
  findCartForUser,
  assertCartOwnership
} from './cart.helpers.js';

export const listCarts = async (currentUser) => {
  const isAdmin = String(currentUser.role).toLowerCase() === 'admin';
  const where = isAdmin ? {} : { user_id: currentUser.id };

  const carts = await Cart.findAll({
    where,
    include: cartIncludes,
    order: [['id', 'DESC']]
  });

  return carts.map((cart) => formatCart(cart));
};

export const getCartById = async (id, currentUser) => {
  const cart = await Cart.findByPk(id, { include: cartIncludes });

  if (!cart) {
    throw new AppError(404, 'Cart not found');
  }

  assertCartOwnership(cart, currentUser);
  return formatCart(cart);
};

export const createCart = async (currentUser) => {
  const existing = await findCartForUser(currentUser.id);

  if (existing) {
    throw new AppError(409, 'Cart already exists for this user');
  }

  await Cart.create({ user_id: currentUser.id });
  const cart = await findCartForUser(currentUser.id);
  return formatCart(cart);
};

export const updateCart = async (id, currentUser) => {
  const cart = await Cart.findByPk(id, { include: cartIncludes });

  if (!cart) {
    throw new AppError(404, 'Cart not found');
  }

  assertCartOwnership(cart, currentUser);
  return formatCart(cart);
};

export const deleteCart = async (id, currentUser) => {
  const cart = await Cart.findByPk(id);

  if (!cart) {
    throw new AppError(404, 'Cart not found');
  }

  assertCartOwnership(cart, currentUser);

  await sequelize.transaction(async (transaction) => {
    await CartItem.destroy({ where: { cart_id: cart.id }, transaction });
    await cart.destroy({ transaction });
  });

  return { id: Number(id) };
};
