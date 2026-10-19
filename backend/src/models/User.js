import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role'
    });

    User.hasMany(models.RefreshToken, {
      foreignKey: 'user_id',
      as: 'refreshTokens',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Order, {
      foreignKey: 'user_id',
      as: 'orders',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    User.hasMany(models.Review, {
      foreignKey: 'user_id',
      as: 'reviews',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
