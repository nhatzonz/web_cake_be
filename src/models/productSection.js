const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductSection = sequelize.define('productSection', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'product_sections',
  });

  ProductSection.associate = (models) => {
    ProductSection.belongsTo(models.Products, {
      foreignKey: 'product_id',
      as: 'product'
    });
    ProductSection.hasMany(models.ProductSectionItem, {
      foreignKey: 'section_id',
      as: 'items'
    });
  };

  return ProductSection;
};
