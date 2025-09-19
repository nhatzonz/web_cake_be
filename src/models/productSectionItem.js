const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductSectionItem = sequelize.define('productSectionItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    is_image: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'product_section_items',
  });

  ProductSectionItem.associate = (models) => {
    ProductSectionItem.belongsTo(models.ProductSection, {
      foreignKey: 'section_id',
      as: 'section'
    });
  };

  return ProductSectionItem;
};
