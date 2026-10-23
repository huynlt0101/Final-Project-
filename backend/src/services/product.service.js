import { Op } from 'sequelize';
import { Product, Category } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';

export const listProducts = async (query = {}) => {
  const where = {};

  if (query.category_id) {
    where.category_id = Number(query.category_id);
  }

  if (query.search) {
    where.name = { [Op.like]: `%${query.search}%` };
  }

  return Product.findAll({
    where,
    include: [{ association: 'category', attributes: ['id', 'category_name'] }],
    order: [['id', 'DESC']]
  });
};

export const getProductById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [
      { association: 'category', attributes: ['id', 'category_name', 'description'] },
      {
        association: 'reviews',
        include: [{ association: 'user', attributes: ['id', 'username'] }]
      }
    ]
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return product;
};

export const createProduct = async (payload) => {
  const category = await Category.findByPk(payload.category_id);

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  return Product.create({
    category_id: payload.category_id,
    name: payload.name,
    description: payload.description || null,
    price: payload.price,
    stock_quantity: payload.stock_quantity,
    image_url: payload.image_url || null,
    technical_specs: payload.technical_specs || null,
    rating_average: 0
  });
};

export const updateProduct = async (id, payload) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  if (payload.category_id !== undefined) {
    const category = await Category.findByPk(payload.category_id);
    if (!category) {
      throw new AppError(404, 'Category not found');
    }
  }

  await product.update({
    category_id: payload.category_id ?? product.category_id,
    name: payload.name ?? product.name,
    description: payload.description !== undefined ? payload.description : product.description,
    price: payload.price ?? product.price,
    stock_quantity: payload.stock_quantity ?? product.stock_quantity,
    image_url: payload.image_url !== undefined ? payload.image_url : product.image_url,
    technical_specs: payload.technical_specs !== undefined ? payload.technical_specs : product.technical_specs
  });

  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  await product.destroy();
  return { id: Number(id) };
};
