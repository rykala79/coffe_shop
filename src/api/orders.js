import express from 'express';

import Orders from '../services/orders';
import errorResponse from '../utils/errorResponse';

const { Router } = express;
const router = Router();

const orders = new Orders();

router.get('/', (req, res) => {
  res.json({
    availableMethods: [
      'GET /:id?dateFrom&dateTo&page',
      'POST /:id',
      'PUT',
      'DELETE /:id',
    ],
  });
});

router.get('/:id?', async (req, res) => {
  console.log(`GET ORDERS ${req.params.id}`, req.query);

  try {
    const orderData = await orders.getOrders(req.params.id, {
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      page: req.query.page,
    });

    return res.json({
      orders: orderData,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.post('/:id?', async (req, res) => {
  const order = { _id: req.params.id, ...req.body };
  console.log(`POST ORDER`, order);

  try {
    const updatedCount = await orders.updateOrder(order);
    return res.json({
      updated: updatedCount,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.put('/:id?', async (req, res) => {
  const order = { _id: req.params.id, ...req.body };
  console.log(`PUT ORDER`, order);

  try {
    const orderId = await orders.addOrder(order);
    return res.json({
      id: orderId,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.delete('/:id', async (req, res) => {
  console.log(`DELETE ORDER ${req.params.id}`);

  try {
    await orders.deleteOrder(req.params.id);
    return res.json({
      ok: true,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

export default router;