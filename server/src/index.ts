import express from 'express';
import cors from 'cors';
import AppConfig from './config/index';
import * as productController from './api/products/product.controller';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/products', productController.getProducts);
app.get('/api/products/:id', productController.getProductById);

// Start server
const PORT = AppConfig.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 