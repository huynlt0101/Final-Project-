import { Cart } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';

export const cartIncludes = [
  {
    association: 'cartItems',
    include: [
      {
        association: 'product',
        attributes: ['id', 'name', 'price', 'stock_quantity', 'image_url']
      }
    ]
  }
];

export const formatCartItem = (item) => {
  const plain = item.toJSON ? item.toJSON() : item;
  const unitPrice = Number(plain.product?.price || 0);
  const quantity = Number(plain.quantity || 0);

  return {
    ...plain,
    unit_price: unitPrice,
    line_total: unitPrice * quantity
  };
};

export const formatCart = (cart) => {
  if (!cart) {
    return null;
  }

  const plain = cart.toJSON();
  let subtotal = 0;
  let totalQuantity = 0;

  const items = (plain.cartItems || []).map((item) => {
    const formatted = formatCartItem(item);
    subtotal += formatted.line_total;
    totalQuantity += formatted.quantity;
    return formatted;
  });

  return {
    id: plain.id,
    user_id: plain.user_id,
    items,
    item_count: items.length,
    total_quantity: totalQuantity,
    subtotal,
    created_at: plain.created_at,
    updated_at: plain.updated_at
  };
};

export const findCartForUser = async (userId, transaction = undefined) => {
  return Cart.findOne({
    where: { user_id: userId },
    include: cartIncludes,
    transaction
  });
};

export const assertCartOwnership = (cart, currentUser) => {
  const isAdmin = String(currentUser.role).toLowerCase() === 'admin';

  if (!isAdmin && cart.user_id !== currentUser.id) {
    throw new AppError(403, 'Access denied');
  }
};

export const assertProductStock = (product, quantity) => {
  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  if (product.stock_quantity < quantity) {
    throw new AppError(409, `Insufficient stock for product ${product.name}`);
  }
};
