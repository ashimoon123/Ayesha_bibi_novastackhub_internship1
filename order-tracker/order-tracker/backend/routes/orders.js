const express = require('express');
const store = require('../data/store');

/**
 * @param {import('socket.io').Server} io
 * @param {{broadcastAlert: Function}} sse
 */
function buildOrdersRouter(io, sse) {
  const router = express.Router();
  const { emitOrderStatusUpdate } = require('../sockets/socketHandler');

  // GET /api/v1/catalog
  router.get('/catalog', (req, res) => {
    res.json({ data: store.catalog });
  });

  // GET /api/v1/orders
  router.get('/orders', (req, res) => {
    res.json({ data: store.listOrders() });
  });

  // GET /api/v1/orders/:id
  router.get('/orders/:id', (req, res) => {
    const order = store.getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ data: order });
  });

  // POST /api/v1/orders  { customerName, item }
  router.post('/orders', (req, res) => {
    const { customerName, item } = req.body || {};
    if (!customerName || !item) {
      return res.status(400).json({ error: 'customerName and item are required' });
    }
    const order = store.createOrder({ customerName, item });
    sse.broadcastAlert('ORDER_CREATED', {
      message: `New order placed by ${customerName} for ${item}`,
      orderId: order.id
    });
    res.status(201).json({ data: order });
  });

  // PATCH /api/v1/orders/:id/status  { status }
  router.patch('/orders/:id/status', (req, res) => {
    const { status } = req.body || {};
    const result = store.updateStatus(req.params.id, status);
    if (result.error === 'NOT_FOUND') return res.status(404).json({ error: 'Order not found' });
    if (result.error === 'INVALID_STATUS') {
      return res.status(400).json({ error: `status must be one of ${store.VALID_STATUSES.join(', ')}` });
    }
    if (result.error === 'ORDER_CLOSED') {
      return res.status(409).json({ error: 'Order is already delivered or cancelled' });
    }

    emitOrderStatusUpdate(io, result.order);
    sse.broadcastAlert('ORDER_STATUS_CHANGED', {
      message: `Order ${result.order.id} is now ${result.order.status}`,
      orderId: result.order.id,
      status: result.order.status
    });

    res.json({ data: result.order });
  });

  return router;
}

module.exports = buildOrdersRouter;
