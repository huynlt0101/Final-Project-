import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      technical_specs: {
        type: DataTypes.JSON,
        allowNull: true
      },
      rating_average: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: 'products',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    Product.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
      as: 'orderItems',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    Product.hasMany(models.Review, {
      foreignKey: 'product_id',
      as: 'reviews',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };

  return Product;
};
