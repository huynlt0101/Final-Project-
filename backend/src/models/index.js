import sequelize from '../config/database.js';
import UserModel from './User.js';
import CategoryModel from './Category.js';
import ProductModel from './Product.js';
import OrderModel from './Order.js';
import OrderItemModel from './OrderItem.js';
import ReviewModel from './Review.js';

const User = UserModel(sequelize);
const Category = CategoryModel(sequelize);
const Product = ProductModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);
const Review = ReviewModel(sequelize);

const models = {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Review
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Review
};

export default {
  sequelize,
  ...models
};
