'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('reviews', ['user_id', 'product_id'], {
      unique: true,
      name: 'reviews_user_id_product_id_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('reviews', 'reviews_user_id_product_id_unique');
  }
};
