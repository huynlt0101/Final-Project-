'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.bulkInsert('roles', [
      { name: 'admin', description: 'Administrator', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'moderator', description: 'Moderator', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'user', description: 'Standard user', is_active: true, created_at: new Date(), updated_at: new Date() }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('roles');
  }
};
