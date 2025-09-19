const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ShopInfo = sequelize.define('shopInfo', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true ,
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true ,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true ,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true ,
    },
    link_face: {
      type: DataTypes.STRING(255),
      allowNull: true ,
    },
    link_mess: {
      type: DataTypes.STRING(255),
      allowNull: true ,
    },
    link_tiktok: {
      type: DataTypes.STRING(255),
      allowNull: true ,
    },
    logo_image: {
      type: DataTypes.STRING(255),
      allowNull: true ,
    },
  }, {
    tableName: 'shopInfo',
  });

  return ShopInfo;
};


