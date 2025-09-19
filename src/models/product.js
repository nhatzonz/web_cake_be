const { DataTypes } = require("sequelize");
const ProductImages = require("./productImage");

module.exports = (sequelize) => {
    const Products  = sequelize.define('products', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        instock: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        star1: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        star2: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        tableName: 'products',
    });
    Products.associate = (models) => {
        Products.hasMany(models.ProductImages, { foreignKey: 'product_id', as: 'images' });
        Products.belongsTo(models.Categories, { foreignKey: 'category_id', as: 'category' });
        Products.hasMany(models.ProductAttributeValues, { foreignKey: 'product_id', as: 'product_attribute_values' });
    };
    
    return Products;
}