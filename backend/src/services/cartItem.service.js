import { sequelize, CartItem, Product } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';
import {
  formatCart,
  formatCartItem,
  findCartForUser,
  assertCartOwnership,
  assertProductStock
} from './cart.helpers.js';

export const listCartItems = async (currentUser) => {
  const cart = await findCartForUser(currentUser.id);

  if (!cart) {
    throw new AppError(404, 'Cart not found');
  }

  return formatCart(cart).items;
};

export const getCartItemById = async (id, currentUser) => {
  const cartItem = await CartItem.findByPk(id, {
    include: [{ association: 'cart' }, { association: 'product' }]
  });

  if (!cartItem) {
    throw new AppError(404, 'Cart item not found');
  }

  assertCartOwnership(cartItem.cart, currentUser);
  return formatCartItem(cartItem);
};

export const createCartItem = async (currentUser, { product_id, quantity = 1 }) => {
  const productId = Number(product_id);
  const qty = Number(quantity);

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new AppError(400, 'Invalid product_id');
  }

  if (!Number.isInteger(qty) || qty <= 0) {
    throw new AppError(400, 'Quantity must be a positive integer');
  }

  return sequelize.transaction(async (transaction) => {
    const cart = await findCartForUser(currentUser.id, transaction);

    if (!cart) {
      throw new AppError(404, 'Cart not found. Create a cart with POST /api/cart first');
    }

    const product = await Product.findByPk(productId, { transaction });
    assertProductStock(product, qty);

    const existingItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
      transaction
    });

    if (existingItem) {
      throw new AppError(
        409,
        'Product already in cart. Use PUT /api/cart/items/:id to update quantity'
      );
    }

    const cartItem = await CartItem.create(
      {
        cart_id: cart.id,
        product_id: productId,
        quantity: qty
      },
      { transaction }
    );

    const created = await CartItem.findByPk(cartItem.id, {
      include: [{ association: 'product' }],
      transaction
    });

    return formatCartItem(created);
  });
};

export const updateCartItem = async (currentUser, id, quantity) => {
  const qty = Number(quantity);

  if (!Number.isInteger(qty) || qty <= 0) {
    throw new AppError(400, 'Quantity must be a positive integer');
  }

  return sequelize.transaction(async (transaction) => {
    const cartItem = await CartItem.findByPk(id, {
      include: [{ association: 'cart' }, { association: 'product' }],
      transaction
    });

    if (!cartItem) {
      throw new AppError(404, 'Cart item not found');
    }

    assertCartOwnership(cartItem.cart, currentUser);
    assertProductStock(cartItem.product, qty);

    await cartItem.update({ quantity: qty }, { transaction });

    const updated = await CartItem.findByPk(id, {
      include: [{ association: 'product' }],
      transaction
    });

    return formatCartItem(updated);
  });
};

export const deleteCartItem = async (currentUser, id) => {
  return sequelize.transaction(async (transaction) => {
    const cartItem = await CartItem.findByPk(id, {
      include: [{ association: 'cart' }, { association: 'product' }],
      transaction
    });

    if (!cartItem) {
      throw new AppError(404, 'Cart item not found');
    }

    assertCartOwnership(cartItem.cart, currentUser);

    const removed = formatCartItem(cartItem);
    await cartItem.destroy({ transaction });
    return removed;
  });
};
