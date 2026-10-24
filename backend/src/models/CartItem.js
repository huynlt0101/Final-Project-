import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CartItem = sequelize.define(
    'CartItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'carts',
          key: 'id'
        }
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1
        }
      }
    },
    {
      tableName: 'cart_items',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['cart_id', 'product_id']
        }
      ]
    }
  );

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      as: 'cart',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    CartItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };

  return CartItem;
};
