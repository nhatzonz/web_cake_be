const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RequestCall = sequelize.define('request_calls', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    phone: { 
      type: DataTypes.STRING(20), 
      allowNull: false 
    },
    note: { 
      type: DataTypes.STRING(255), 
      allowNull: true 
    },
    created_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
  }, { 
    tableName: 'request_calls',
    timestamps: false 
  });

  return RequestCall;
};
