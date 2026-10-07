'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');

    if (!table.username) {
      await queryInterface.addColumn('users', 'username', {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true
      });
    }

    if (!table.role_id) {
      await queryInterface.addColumn('users', 'role_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'roles',
          key: 'id'
        }
      });
    }

    if (!table.department_id) {
      await queryInterface.addColumn('users', 'department_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      });
    }

    if (!table.is_active) {
      await queryInterface.addColumn('users', 'is_active', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      });
    }

    if (table.email && !table.username) {
      await queryInterface.sequelize.query(
        "UPDATE users SET username = LOWER(SUBSTRING_INDEX(email, '@', 1)) WHERE username IS NULL OR username = ''"
      );
    }

    if (table.role_id) {
      await queryInterface.sequelize.query(
        "UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'user' LIMIT 1) WHERE role_id IS NULL"
      );
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('users');

    if (table.username) {
      await queryInterface.removeColumn('users', 'username');
    }

    if (table.role_id) {
      await queryInterface.removeColumn('users', 'role_id');
    }

    if (table.department_id) {
      await queryInterface.removeColumn('users', 'department_id');
    }

    if (table.is_active) {
      await queryInterface.removeColumn('users', 'is_active');
    }
  }
};
