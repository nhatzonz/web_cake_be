const { DataTypes } = require('sequelize');
const Products = require("./product");
module.exports = (sequelize) => {
  const ProductImages = sequelize.define('product_images', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    image_url: { type: DataTypes.STRING(500), allowNull: false },
    alt_text: { type: DataTypes.STRING(255), allowNull: true },
    is_main: { type: DataTypes.BOOLEAN, defaultValue: false },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'product_images' });
  ProductImages.associate = (models) => {
    ProductImages.belongsTo(models.Products, { foreignKey: 'product_id', as: 'product' });
  };
  return ProductImages;
};


