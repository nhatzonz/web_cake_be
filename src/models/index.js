const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'cakeshop';
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || '';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: false,
    freezeTableName: true,
  },
});


const db = {};
db.sequelize = sequelize;

db.User = require('./user')(sequelize);
db.Banner = require('./banner')(sequelize);
db.ShopInfo = require('./shopInfo')(sequelize);
db.Categories = require('./categorie')(sequelize);
db.Products = require('./product')(sequelize);
db.ProductAttributes = require('./productAttribute')(sequelize);
db.ProductImages = require('./productImage')(sequelize);
db.ProductAttributeValues = require('./productAttributeValue')(sequelize);
db.Orders = require('./order')(sequelize);
db.OrderItems = require('./orderItem')(sequelize);
db.RequestCall = require('./requestCall')(sequelize);
db.ProductSection = require('./productSection')(sequelize);
db.ProductSectionItem = require('./productSectionItem')(sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName] && typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

module.exports = db;


