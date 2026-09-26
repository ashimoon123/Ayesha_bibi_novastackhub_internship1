/**
 * Minimal JSON-RPC 2.0 server mounted at POST /rpc.
 * Spec: https://www.jsonrpc.org/specification
 *
 * Request:  { "jsonrpc": "2.0", "method": "cancelOrder", "params": {"orderId": "..."}, "id": 1 }
 * Response: { "jsonrpc": "2.0", "result": {...}, "id": 1 }
 * Error:    { "jsonrpc": "2.0", "error": { "code": -32601, "message": "..." }, "id": 1 }
 */
const store = require('../data/store');

const ERR = {
  PARSE: { code: -32700, message: 'Parse error' },
  INVALID_REQUEST: { code: -32600, message: 'Invalid Request' },
  METHOD_NOT_FOUND: { code: -32601, message: 'Method not found' },
  INVALID_PARAMS: { code: -32602, message: 'Invalid params' },
  INTERNAL: { code: -32603, message: 'Internal error' }
};

function buildRpcHandler(io, sse) {
  const { emitOrderStatusUpdate } = require('../sockets/socketHandler');

  const methods = {
    listMethods: () => ({ methods: Object.keys(methods) }),

    getOrderStatus: (params) => {
      const { orderId } = params || {};
      if (!orderId) throw rpcError(ERR.INVALID_PARAMS, 'orderId is required');
      const order = store.getOrder(orderId);
      if (!order) throw rpcError(ERR.INVALID_PARAMS, 'Order not found');
      return { orderId: order.id, status: order.status, updatedAt: order.updatedAt };
    },

    cancelOrder: (params) => {
      const { orderId } = params || {};
      if (!orderId) throw rpcError(ERR.INVALID_PARAMS, 'orderId is required');
      const result = store.cancelOrder(orderId);
      if (result.error === 'NOT_FOUND') throw rpcError(ERR.INVALID_PARAMS, 'Order not found');
      if (result.error === 'ORDER_CLOSED') {
        throw rpcError({ code: -32000, message: 'Order already delivered or cancelled' });
      }

      emitOrderStatusUpdate(io, result.order);
      sse.broadcastAlert('ORDER_CANCELLED', {
        message: `Order ${result.order.id} was cancelled via JSON-RPC`,
        orderId: result.order.id
      });

      return { orderId: result.order.id, status: result.order.status };
    },

    listOrders: () => ({ orders: store.listOrders() })
  };

  function rpcError({ code, message }, detail) {
    const err = new Error(detail || message);
    err.rpc = { code, message: detail ? `${message}: ${detail}` : message };
    return err;
  }

  function makeResponse(id, result) {
    return { jsonrpc: '2.0', result, id: id === undefined ? null : id };
  }
  function makeError(id, error) {
    return { jsonrpc: '2.0', error, id: id === undefined ? null : id };
  }

  async function handleSingle(body) {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return makeError(null, ERR.INVALID_REQUEST);
    }
    const { jsonrpc, method, params, id } = body;
    if (jsonrpc !== '2.0' || typeof method !== 'string') {
      return makeError(id, ERR.INVALID_REQUEST);
    }
    const fn = methods[method];
    if (!fn) return makeError(id, ERR.METHOD_NOT_FOUND);

    try {
      const result = await fn(params);
      // Notification (no id) -> no response body expected, but we still
      // return null upstream so callers can decide whether to send it.
      return id === undefined ? null : makeResponse(id, result);
    } catch (err) {
      if (err.rpc) return makeError(id, err.rpc);
      return makeError(id, ERR.INTERNAL);
    }
  }

  return async function rpcRoute(req, res) {
    const body = req.body;
    try {
      if (Array.isArray(body)) {
        const responses = (await Promise.all(body.map(handleSingle))).filter(Boolean);
        return res.json(responses);
      }
      const response = await handleSingle(body);
      if (response === null) return res.status(204).end(); // notification, no reply
      return res.json(response);
    } catch (e) {
      return res.status(200).json(makeError(null, ERR.PARSE));
    }
  };
}

module.exports = buildRpcHandler;
