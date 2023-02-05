import express from 'express';
import Products from '../services/products';
import errorResponse from '../utils/errorResponse';

const { Router } = express;
const router = Router();

const products = new Products();

router.get('/', (req, res) => {
  res.json({
    availableMethods: [
      'GET /:id?amountAtLeast&brand&categories&page',
      'POST /:id',
      'PUT',
      'DELETE /:id',
    ],
  });
});

router.get('/:id?', async (req, res) => {
  console.log(`GET PRODUCTS ${req.params.id}`, req.query);

  try {
    const productData = await products.getProducts(req.params.id, {
      amountAtLeast: req.query.amountAtLeast,
      brand: req.query.brand,
      categories: req.query.categories,
      page: req.query.page,
    });

    return res.json({
      products: productData,
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Generic server error',
      message: err.message,
    });
  }
});

router.post('/:id?', async (req, res) => {
  const product = { _id: req.params.id, ...req.body };
  console.log(`POST PRODUCTS`, product);

  try {
    const updatedCount = await products.updateProduct(product);
    return res.json({
      updated: updatedCount,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.put('/:id?', async (req, res) => {
  const product = { _id: req.params.id, ...req.body };
  console.log(`PUT PRODUCTS`, product);

  try {
    const productId = await products.addProduct(product);
    return res.json({
      id: productId,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.delete('/:id', async (req, res) => {
  console.log(`DELETE PRODUCTS ${req.params.id}`);

  try {
    await products.deleteProduct(req.params.id);
    return res.json({
      ok: true,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

export default router;