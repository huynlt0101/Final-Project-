import { Review, Product } from '../models/index.js';
import { AppError } from '../middleware/error.middleware.js';

const recalculateProductRating = async (productId) => {
  const reviews = await Review.findAll({
    where: { product_id: productId },
    attributes: ['rating']
  });

  const average =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await Product.update(
    { rating_average: Number(average.toFixed(2)) },
    { where: { id: productId } }
  );
};

export const listReviewsByProduct = async (productId) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return Review.findAll({
    where: { product_id: productId },
    include: [{ association: 'user', attributes: ['id', 'username'] }],
    order: [['created_at', 'DESC']]
  });
};

export const getReviewById = async (id) => {
  const review = await Review.findByPk(id, {
    include: [
      { association: 'user', attributes: ['id', 'username'] },
      { association: 'product', attributes: ['id', 'name'] }
    ]
  });

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  return review;
};

export const createReview = async (currentUser, payload) => {
  const product = await Product.findByPk(payload.product_id);

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  const existing = await Review.findOne({
    where: {
      user_id: currentUser.id,
      product_id: payload.product_id
    }
  });

  if (existing) {
    throw new AppError(409, 'You have already reviewed this product');
  }

  const review = await Review.create({
    user_id: currentUser.id,
    product_id: payload.product_id,
    rating: payload.rating,
    comment: payload.comment || null
  });

  await recalculateProductRating(payload.product_id);

  return getReviewById(review.id);
};

export const updateReview = async (id, currentUser, payload) => {
  const review = await Review.findByPk(id);

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  const isAdmin = String(currentUser.role).toLowerCase() === 'admin';
  if (!isAdmin && review.user_id !== currentUser.id) {
    throw new AppError(403, 'Access denied');
  }

  await review.update({
    rating: payload.rating ?? review.rating,
    comment: payload.comment !== undefined ? payload.comment : review.comment
  });

  await recalculateProductRating(review.product_id);

  return getReviewById(review.id);
};

export const deleteReview = async (id, currentUser) => {
  const review = await Review.findByPk(id);

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  const isAdmin = String(currentUser.role).toLowerCase() === 'admin';
  if (!isAdmin && review.user_id !== currentUser.id) {
    throw new AppError(403, 'Access denied');
  }

  const productId = review.product_id;
  await review.destroy();
  await recalculateProductRating(productId);

  return { id: Number(id) };
};
