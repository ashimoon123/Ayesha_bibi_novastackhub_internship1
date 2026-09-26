/**
 * In-memory data store.
 * Swap this module for a real database (Mongo/Postgres) in production —
 * every other module only talks to the functions exported here, so the
 * REST routes, JSON-RPC handler, and Socket.io layer never touch storage
 * details directly.
 */
const { v4: uuidv4 } = require('uuid');

const VALID_STATUSES = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

const catalog = [
  { sku: 'SKU-001', name: 'Wireless Mouse', price: 19.99 },
  { sku: 'SKU-002', name: 'Mechanical Keyboard', price: 79.99 },
  { sku: 'SKU-003', name: '27" Monitor', price: 229.99 },
  { sku: 'SKU-004', name: 'USB-C Hub', price: 34.5 },
  { sku: 'SKU-005', name: 'Webcam 1080p', price: 49.0 }
];

/** @type {Map<string, object>} */
const orders = new Map();

function seed() {
  const o1 = createOrder({ customerName: 'Ayesha Khan', item: 'Wireless Mouse' });
  updateStatus(o1.id, 'processing');
  createOrder({ customerName: 'Bilal Ahmed', item: 'Mechanical Keyboard' });
}

function listOrders() {
  return Array.from(orders.values()).sort((a, b) => b.createdAt - a.createdAt);
}

function getOrder(id) {
  return orders.get(id) || null;
}

function createOrder({ customerName, item }) {
  const id = uuidv4();
  const now = Date.now();
  const order = {
    id,
    customerName,
    item,
    status: 'placed',
    createdAt: now,
    updatedAt: now,
    history: [{ status: 'placed', at: now }]
  };
  orders.set(id, order);
  return order;
}

function updateStatus(id, status) {
  const order = orders.get(id);
  if (!order) return { error: 'NOT_FOUND' };
  if (!VALID_STATUSES.includes(status)) return { error: 'INVALID_STATUS' };
  if (order.status === 'cancelled' || order.status === 'delivered') {
    return { error: 'ORDER_CLOSED' };
  }
  order.status = status;
  order.updatedAt = Date.now();
  order.history.push({ status, at: order.updatedAt });
  return { order };
}

function cancelOrder(id) {
  const order = orders.get(id);
  if (!order) return { error: 'NOT_FOUND' };
  if (order.status === 'delivered' || order.status === 'cancelled') {
    return { error: 'ORDER_CLOSED' };
  }
  order.status = 'cancelled';
  order.updatedAt = Date.now();
  order.history.push({ status: 'cancelled', at: order.updatedAt });
  return { order };
}

module.exports = {
  VALID_STATUSES,
  catalog,
  seed,
  listOrders,
  getOrder,
  createOrder,
  updateStatus,
  cancelOrder
};
