const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItems = sequelize.define('order_items', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    product_name: { type: DataTypes.STRING(255), allowNull: false },
    attribute_summary: { type: DataTypes.STRING(255) },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    total: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  }, { tableName: 'order_items' });

  OrderItems.associate = (models) => {
    OrderItems.belongsTo(models.Orders, { foreignKey: 'order_id', as: 'order' });
    OrderItems.belongsTo(models.Products, { foreignKey: 'product_id', as: 'product' });
  };

  return OrderItems;
};


