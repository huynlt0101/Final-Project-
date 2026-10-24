'use strict';

const path = require('path');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const DEFAULT_USERNAME = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
const DEFAULT_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
const DEFAULT_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@12345';

module.exports = {
  async up(queryInterface) {
    const [adminRoles] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'admin' LIMIT 1"
    );

    if (!adminRoles.length) {
      throw new Error("Role 'admin' not found. Run migrations first (npm run db:migrate).");
    }

    const adminRoleId = adminRoles[0].id;
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
    const now = new Date();

    const [existingByEmail] = await queryInterface.sequelize.query(
      'SELECT id, role_id FROM users WHERE email = :email LIMIT 1',
      { replacements: { email: DEFAULT_EMAIL } }
    );

    if (existingByEmail.length) {
      await queryInterface.sequelize.query(
        'UPDATE users SET role_id = :roleId, updated_at = :now WHERE id = :id',
        {
          replacements: {
            roleId: adminRoleId,
            now,
            id: existingByEmail[0].id
          }
        }
      );
      return;
    }

    const [existingByUsername] = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE username = :username LIMIT 1',
      { replacements: { username: DEFAULT_USERNAME } }
    );

    if (existingByUsername.length) {
      throw new Error(
        `Username "${DEFAULT_USERNAME}" is already taken. Set DEFAULT_ADMIN_USERNAME in .env and run the seeder again.`
      );
    }

    await queryInterface.bulkInsert('users', [
      {
        username: DEFAULT_USERNAME,
        email: DEFAULT_EMAIL,
        password: passwordHash,
        role_id: adminRoleId,
        department_id: null,
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: DEFAULT_EMAIL });
  }
};
