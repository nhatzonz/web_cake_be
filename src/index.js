const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const shopInfoRoutes = require('./routes/shopInfoRouters');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categorieRoutes = require('./routes/categorieRoute');
const requestCallRoutes = require('./routes/requestCallRoutes');
const productSectionRoutes = require('./routes/productSectionRouters');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static
const publicDir = path.join(__dirname, '..', 'public');
app.use('/uploads', express.static(path.join(publicDir, 'uploads')));
app.use(express.static(publicDir));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/shopInfo', shopInfoRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/request-calls', requestCallRoutes);
app.use('/api/product-sections', productSectionRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5002;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

start();


