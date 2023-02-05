import express from 'express';

import orders from './orders';
import products from './products';
import staff from './staff';

const { Router } = express;

// Main router - returns specific paths to API routes
const mainRouter = Router();
mainRouter.use('/orders', orders);
mainRouter.use('/products', products);
mainRouter.use('/staff', staff);

// This will add /api prefix to all routes
const apiRouter = Router();
apiRouter.use('/api/1', mainRouter);

// Main API response - just informs about available paths
apiRouter.get('/api/1', (req, res) => {
  res.json({
    availablePaths: ['/orders', '/products', '/staff'],
  });
});

// 404 supports
apiRouter.use((req, res) => {
  res.status(404).json({
    message: 'Not found',
    status: 404,
  });
});

export default apiRouter;
