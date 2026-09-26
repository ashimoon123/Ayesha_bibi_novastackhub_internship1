/**
 * Socket.io event layer.
 *
 * Rooms are named `order-<orderId>` — a customer and a support agent who
 * both join the same order's room get each other's chat messages and any
 * live status update pushed for that order.
 *
 * Events documented fully in README.md.
 */
function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    const { role = 'customer', name = 'Guest' } = socket.handshake.query || {};
    socket.data.role = role;
    socket.data.name = name;

    socket.emit('connected', { socketId: socket.id, role, name });

    // Client -> Server: join a specific order's chat/status room
    socket.on('joinRoom', ({ orderId }) => {
      if (!orderId) return;
      const room = `order-${orderId}`;
      socket.join(room);
      socket.data.orderId = orderId;
      socket.to(room).emit('systemMessage', {
        message: `${role === 'support' ? 'Support agent' : name} joined the chat`,
        orderId,
        timestamp: Date.now()
      });
    });

    socket.on('leaveRoom', ({ orderId }) => {
      if (!orderId) return;
      socket.leave(`order-${orderId}`);
    });

    // Client -> Server: 1-on-1 chat message, relayed to everyone else in the room
    socket.on('chatMessage', ({ orderId, message }) => {
      if (!orderId || !message) return;
      const payload = {
        orderId,
        sender: name,
        role,
        message,
        timestamp: Date.now()
      };
      io.to(`order-${orderId}`).emit('chatMessage', payload);
    });

    // Optional typing indicator
    socket.on('typing', ({ orderId, isTyping }) => {
      if (!orderId) return;
      socket.to(`order-${orderId}`).emit('typing', { orderId, name, isTyping: !!isTyping });
    });

    socket.on('disconnect', () => {
      const orderId = socket.data.orderId;
      if (orderId) {
        socket.to(`order-${orderId}`).emit('systemMessage', {
          message: `${role === 'support' ? 'Support agent' : name} left the chat`,
          orderId,
          timestamp: Date.now()
        });
      }
    });
  });
}

/**
 * Called by REST routes / JSON-RPC methods whenever an order's status
 * changes, so every socket in that order's room gets a live push.
 */
function emitOrderStatusUpdate(io, order) {
  io.to(`order-${order.id}`).emit('orderStatusUpdate', {
    orderId: order.id,
    status: order.status,
    updatedAt: order.updatedAt
  });
}

module.exports = { registerSocketHandlers, emitOrderStatusUpdate };
