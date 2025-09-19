const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Orders = sequelize.define('orders', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    customer_name: { type: DataTypes.STRING(255), allowNull: false },
    customer_phone: { type: DataTypes.STRING(20), allowNull: false },
    delivery_type: { type: DataTypes.ENUM('self','gift'), defaultValue: 'self' },
    pickup_branch: { type: DataTypes.STRING(255) },
    district: { type: DataTypes.STRING(255) },
    ward: { type: DataTypes.STRING(255) },
    province: { type: DataTypes.STRING(255) },
    address: { type: DataTypes.TEXT },
    delivery_time: { type: DataTypes.DATE },
    message_on_cake: { type: DataTypes.STRING(255) },
    note: { type: DataTypes.TEXT },
    payment_method: { type: DataTypes.ENUM('bank','cod'), defaultValue: 'cod' },
    status: { type: DataTypes.ENUM('pending','confirmed','shipped','completed','cancelled'), defaultValue: 'pending' },
    total: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    isDelete: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { tableName: 'orders' });

  Orders.associate = (models) => {
    Orders.hasMany(models.OrderItems, { foreignKey: 'order_id', as: 'items' });
  };

  return Orders;
};


