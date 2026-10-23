import { sequelize, Order, OrderItem, Product } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';

const orderIncludes = [
  {
    association: 'orderItems',
    include: [{ association: 'product', attributes: ['id', 'name', 'image_url', 'price'] }]
  },
  { association: 'user', attributes: ['id', 'username', 'email'] }
];

export const listOrders = async (currentUser) => {
  const where = {};

  if (String(currentUser.role).toLowerCase() !== 'admin') {
    where.user_id = currentUser.id;
  }

  return Order.findAll({
    where,
    include: orderIncludes,
    order: [['id', 'DESC']]
  });
};

export const getOrderById = async (id, currentUser) => {
  const order = await Order.findByPk(id, { include: orderIncludes });

  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  const isAdmin = String(currentUser.role).toLowerCase() === 'admin';
  if (!isAdmin && order.user_id !== currentUser.id) {
    throw new AppError(403, 'Access denied');
  }

  return order;
};

export const createOrder = async (currentUser, payload) => {
  const items = Array.isArray(payload.items) ? payload.items : [];

  if (items.length === 0) {
    throw new AppError(400, 'Order must include at least one item');
  }

  return sequelize.transaction(async (transaction) => {
    let totalAmount = 0;
    const preparedItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!product) {
        throw new AppError(404, `Product ${item.product_id} not found`);
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new AppError(400, `Invalid quantity for product ${product.id}`);
      }

      if (product.stock_quantity < quantity) {
        throw new AppError(409, `Insufficient stock for product ${product.name}`);
      }

      const lineTotal = product.price * quantity;
      totalAmount += lineTotal;

      preparedItems.push({
        product,
        quantity,
        price_at_purchase: product.price
      });
    }

    const order = await Order.create(
      {
        user_id: currentUser.id,
        order_date: new Date(),
        total_amount: totalAmount,
        payment_status: payload.payment_status || 'pending',
        payment_method: payload.payment_method,
        shipping_address: payload.shipping_address
      },
      { transaction }
    );

    for (const item of preparedItems) {
      await OrderItem.create(
        {
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_purchase: item.price_at_purchase
        },
        { transaction }
      );

      await item.product.update(
        { stock_quantity: item.product.stock_quantity - item.quantity },
        { transaction }
      );
    }

    return Order.findByPk(order.id, {
      include: orderIncludes,
      transaction
    });
  });
};

export const updateOrderPaymentStatus = async (id, paymentStatus, currentUser) => {
  const order = await Order.findByPk(id);

  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  const isAdmin = String(currentUser.role).toLowerCase() === 'admin';
  if (!isAdmin && order.user_id !== currentUser.id) {
    throw new AppError(403, 'Access denied');
  }

  await order.update({ payment_status: paymentStatus });

  return Order.findByPk(id, { include: orderIncludes });
};
