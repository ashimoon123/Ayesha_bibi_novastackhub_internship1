require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const store = require('./data/store');
const sse = require('./sse/sseManager');
const buildOrdersRouter = require('./routes/orders');
const buildRpcHandler = require('./rpc/rpcHandler');
const { registerSocketHandlers } = require('./sockets/socketHandler');

const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGIN, methods: ['GET', 'POST'] }
});

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

// ---- Serve frontend static files ----
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ---- Health check ----
app.get('/health', (req, res) => {
  res.json({
    service: 'order-tracker-backend',
    status: 'ok',
    protocols: {
      rest: '/api/v1/orders',
      graphqlNote: 'REST implementation used (see README for GraphQL notes)',
      websockets: 'Socket.io on the same origin/port',
      jsonRpc: '/rpc',
      sse: '/events'
    }
  });
});

// ---- 1. REST: resource management ----
app.use('/api/v1', buildOrdersRouter(io, sse));

// ---- 3. JSON-RPC 2.0 ----
app.post('/rpc', buildRpcHandler(io, sse));

// ---- 4. Server-Sent Events ----
app.get('/events', sse.handleSSE);

// ---- 2. WebSockets (Socket.io) ----
registerSocketHandlers(io);

// Seed a couple of demo orders so the frontend has data on first load.
store.seed();

server.listen(PORT, () => {
  console.log(`\n  Order Tracker is running!\n`);
  console.log(`  Frontend + Backend:  http://localhost:${PORT}`);
  console.log(`  REST API:            http://localhost:${PORT}/api/v1/orders`);
  console.log(`  JSON-RPC:            http://localhost:${PORT}/rpc`);
  console.log(`  SSE:                 http://localhost:${PORT}/events`);
  console.log(`  Socket.io:           ws://localhost:${PORT}`);
  console.log(`  Health Check:        http://localhost:${PORT}/health\n`);
});
