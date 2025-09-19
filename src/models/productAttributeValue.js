const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductAttributeValues = sequelize.define('product_attribute_values', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    attribute_id: { type: DataTypes.INTEGER, allowNull: false },
    value: { type: DataTypes.STRING(255), allowNull: false },
    extra_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  }, { tableName: 'product_attribute_values' });
  
  ProductAttributeValues.associate = (models) => {
    ProductAttributeValues.belongsTo(models.ProductAttributes, { foreignKey: 'attribute_id', as: 'product_attribute' });
    ProductAttributeValues.belongsTo(models.Products, { foreignKey: 'product_id', as: 'product' });
  };
  
  return ProductAttributeValues;
};


