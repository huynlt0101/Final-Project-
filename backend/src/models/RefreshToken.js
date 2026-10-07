import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      token_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      revoked_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      tableName: 'refresh_tokens',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return RefreshToken;
};
