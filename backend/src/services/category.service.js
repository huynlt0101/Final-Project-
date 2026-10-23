import { Category, Product } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';

export const listCategories = async () => {
  return Category.findAll({
    order: [['id', 'ASC']]
  });
};

export const getCategoryById = async (id) => {
  const category = await Category.findByPk(id, {
    include: [{ association: 'products' }]
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  return category;
};

export const createCategory = async (payload) => {
  return Category.create({
    category_name: payload.category_name,
    description: payload.description || null
  });
};

export const updateCategory = async (id, payload) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  await category.update({
    category_name: payload.category_name ?? category.category_name,
    description: payload.description !== undefined ? payload.description : category.description
  });

  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  const productCount = await Product.count({ where: { category_id: id } });

  if (productCount > 0) {
    throw new AppError(409, 'Cannot delete category that still has products');
  }

  await category.destroy();
  return { id: Number(id) };
};
