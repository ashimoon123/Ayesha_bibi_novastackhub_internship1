let API_BASE = window.DEFAULT_API_BASE;
let socket = null;
let currentChatOrderId = null;

const $ = (id) => document.getElementById(id);

// ---------------- Helpers ----------------
async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  return res.json();
}
async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}
async function apiPatch(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}
async function rpcCall(method, params) {
  const res = await fetch(`${API_BASE}/rpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: Date.now() })
  });
  return res.json();
}

function fillOrderSelects(orders) {
  const options = orders
    .map((o) => `<option value="${o.id}">${o.item} — ${o.customerName} (${o.status})</option>`)
    .join('');
  for (const id of ['rpcOrderSelect', 'chatOrderSelect']) {
    const el = $(id);
    const prev = el.value;
    el.innerHTML = options;
    if (prev) el.value = prev;
  }
}

function renderOrders(orders) {
  $('orderList').innerHTML = orders
    .map(
      (o) => `<li>
        <strong>${o.item}</strong> for ${o.customerName}
        <span class="status-pill status-${o.status}">${o.status}</span>
        <div style="color:var(--muted);font-size:0.75rem">#${o.id.slice(0, 8)}</div>
      </li>`
    )
    .join('');
  fillOrderSelects(orders);
}

function addAlert(text) {
  const li = document.createElement('li');
  li.textContent = text;
  $('alertsList').prepend(li);
}

function addChatLine(html, cls = '') {
  const div = document.createElement('div');
  div.className = `chat-msg ${cls}`;
  div.innerHTML = html;
  $('chatLog').appendChild(div);
  $('chatLog').scrollTop = $('chatLog').scrollHeight;
}

// ---------------- REST: catalog + orders ----------------
async function loadCatalog() {
  const { data } = await apiGet('/api/v1/catalog');
  $('itemSelect').innerHTML = data.map((c) => `<option value="${c.name}">${c.name} — $${c.price}</option>`).join('');
}

async function loadOrders() {
  const { data } = await apiGet('/api/v1/orders');
  renderOrders(data || []);
}

$('newOrderForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const customerName = $('customerName').value.trim();
  const item = $('itemSelect').value;
  if (!customerName || !item) return;
  await apiPost('/api/v1/orders', { customerName, item });
  $('customerName').value = '';
  await loadOrders();
});

$('advanceBtn').addEventListener('click', async () => {
  const orderId = $('rpcOrderSelect').value;
  const status = $('progressStatus').value;
  if (!orderId) return;
  await apiPatch(`/api/v1/orders/${orderId}/status`, { status });
  await loadOrders();
});

// ---------------- JSON-RPC 2.0 ----------------
$('cancelBtn').addEventListener('click', async () => {
  const orderId = $('rpcOrderSelect').value;
  if (!orderId) return;
  const result = await rpcCall('cancelOrder', { orderId });
  $('rpcOutput').textContent = JSON.stringify(result, null, 2);
  await loadOrders();
});

$('statusBtn').addEventListener('click', async () => {
  const orderId = $('rpcOrderSelect').value;
  if (!orderId) return;
  const result = await rpcCall('getOrderStatus', { orderId });
  $('rpcOutput').textContent = JSON.stringify(result, null, 2);
});

// ---------------- Socket.io: live status + chat ----------------
function connectSocket() {
  if (socket) socket.disconnect();
  const role = $('roleSelect').value;
  socket = io(API_BASE, { query: { role, name: role === 'support' ? 'Support' : 'Customer' } });

  socket.on('connect', () => setBadge('wsStatus', true, 'WS: connected'));
  socket.on('disconnect', () => setBadge('wsStatus', false, 'WS: disconnected'));

  socket.on('systemMessage', (msg) => addChatLine(msg.message, 'system'));
  socket.on('chatMessage', (msg) => {
    const cls = msg.role === 'support' ? 'support' : '';
    addChatLine(`<span class="who">${msg.sender}:</span> ${escapeHtml(msg.message)}`, cls);
  });
  socket.on('typing', (t) => {
    if (t.isTyping) addChatLine(`<em>${t.name} is typing…</em>`, 'system');
  });
  socket.on('orderStatusUpdate', (update) => {
    addAlert(`🔄 Order ${update.orderId.slice(0, 8)} → ${update.status}`);
    loadOrders();
  });
}

$('joinBtn').addEventListener('click', () => {
  const orderId = $('chatOrderSelect').value;
  if (!orderId || !socket) return;
  currentChatOrderId = orderId;
  socket.emit('joinRoom', { orderId });
  $('chatInput').disabled = false;
  $('sendBtn').disabled = false;
  addChatLine(`Joined chat room for order #${orderId.slice(0, 8)}`, 'system');
});

$('sendBtn').addEventListener('click', sendChat);
$('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendChat();
});

function sendChat() {
  const message = $('chatInput').value.trim();
  if (!message || !currentChatOrderId || !socket) return;
  socket.emit('chatMessage', { orderId: currentChatOrderId, message });
  $('chatInput').value = '';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------------- SSE: live alerts ----------------
function connectSSE() {
  const es = new EventSource(`${API_BASE}/events`);
  es.addEventListener('connected', () => setBadge('sseStatus', true, 'SSE: connected'));
  es.addEventListener('alert', (e) => {
    const data = JSON.parse(e.data);
    addAlert(`📢 [${data.type}] ${data.message}`);
  });
  es.onerror = () => setBadge('sseStatus', false, 'SSE: reconnecting…');
}

function setBadge(id, ok, text) {
  const el = $(id);
  el.textContent = text;
  el.className = `badge ${ok ? 'badge-on' : 'badge-off'}`;
}

// ---------------- Backend URL config ----------------
$('apiBaseInput').value = API_BASE;
$('saveBaseBtn').addEventListener('click', () => {
  const val = $('apiBaseInput').value.trim().replace(/\/$/, '');
  if (!val) return;
  localStorage.setItem('apiBase', val);
  location.reload();
});

// ---------------- Init ----------------
(async function init() {
  await loadCatalog();
  await loadOrders();
  connectSocket();
  connectSSE();
})();
