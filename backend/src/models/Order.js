import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      order_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      payment_status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false
      },
      shipping_address: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'orders',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'orderItems',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };

  return Order;
};
