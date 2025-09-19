const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Banner = sequelize.define('banner', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isSubBanner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'banner',
  });

  return Banner;
};


