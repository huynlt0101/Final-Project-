import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Cart = sequelize.define(
    'Cart',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      tableName: 'carts',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    Cart.hasMany(models.CartItem, {
      foreignKey: 'cart_id',
      as: 'cartItems',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };

  return Cart;
};
