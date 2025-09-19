const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductAttributes = sequelize.define('product_attributes', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    isDelete: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'product_attributes' });
  
  ProductAttributes.associate = (models) => {
    ProductAttributes.hasMany(models.ProductAttributeValues, { foreignKey: 'attribute_id', as: 'attribute_values' });
  };
  
  return ProductAttributes;
};


