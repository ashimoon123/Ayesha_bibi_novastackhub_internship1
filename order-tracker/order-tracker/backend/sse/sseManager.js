/**
 * Server-Sent Events manager.
 * Keeps a registry of open /events connections and lets any other part
 * of the app (REST routes, RPC methods, socket handlers) push a system
 * alert to every connected client with broadcastAlert().
 */
const clients = new Set();

function handleSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no' // disable proxy buffering (nginx/Render)
  });
  res.flushHeaders?.();

  // Tell the client how long to wait before auto-reconnecting if dropped.
  res.write('retry: 3000\n\n');
  res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected to live alerts' })}\n\n`);

  clients.add(res);

  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n'); // comment line, ignored by EventSource, keeps connection alive
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });
}

function broadcastAlert(type, payload) {
  const data = JSON.stringify({ type, ...payload, timestamp: Date.now() });
  for (const res of clients) {
    res.write(`event: alert\ndata: ${data}\n\n`);
  }
}

module.exports = { handleSSE, broadcastAlert };
