import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Review = sequelize.define(
    'Review',
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
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'reviews',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: false
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    Review.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };

  return Review;
};
