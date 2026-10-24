/**
 * Sequelize models (single source of truth for associations).
 *
 * Tables: roles, users, refresh_tokens, categories, products,
 *         orders, order_items, reviews, carts, cart_items
 *
 * Graph:
 *   Role 1—* User 1—* Order *—1 OrderItem *—1 Product *—1 Category
 *   User 1—1 Cart 1—* CartItem *—1 Product
 *   User 1—* Review *—1 Product
 */
import sequelize from '../config/database.js';
import UserModel from './User.js';
import RoleModel from './Role.js';
import RefreshTokenModel from './RefreshToken.js';
import CategoryModel from './Category.js';
import ProductModel from './Product.js';
import OrderModel from './Order.js';
import OrderItemModel from './OrderItem.js';
import ReviewModel from './Review.js';
import CartModel from './Cart.js';
import CartItemModel from './CartItem.js';

const User = UserModel(sequelize);
const Role = RoleModel(sequelize);
const RefreshToken = RefreshTokenModel(sequelize);
const Category = CategoryModel(sequelize);
const Product = ProductModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);
const Review = ReviewModel(sequelize);
const Cart = CartModel(sequelize);
const CartItem = CartItemModel(sequelize);

const models = {
  User,
  Role,
  RefreshToken,
  Category,
  Product,
  Order,
  OrderItem,
  Review,
  Cart,
  CartItem
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export {
  sequelize,
  User,
  Role,
  RefreshToken,
  Category,
  Product,
  Order,
  OrderItem,
  Review,
  Cart,
  CartItem
};

export default {
  sequelize,
  ...models
};
