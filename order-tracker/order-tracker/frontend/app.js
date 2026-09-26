let API_BASE = window.DEFAULT_API_BASE;
let socket = null;
let currentChatOrderId = null;
let allOrders = [];

const $ = (id) => document.getElementById(id);

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
  const container = $('toastContainer');
  const toast = document.createElement('div');
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== Theme Toggle =====
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function updateThemeIcon(theme) {
  const icon = $('themeToggle').querySelector('i');
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

$('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

initTheme();

// ===== Sidebar Navigation =====
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const titles = {
  dashboardSection: 'Dashboard',
  ordersSection: 'Orders',
  rpcSection: 'Actions',
  chatSection: 'Live Chat',
  alertsSection: 'Alerts'
};

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.section;
    sections.forEach(s => s.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));
    $(target).classList.add('active');
    link.classList.add('active');
    $('pageTitle').textContent = titles[target] || 'Dashboard';
    // Close sidebar on mobile
    $('sidebar').classList.remove('open');
  });
});

// Mobile menu toggle
$('menuToggle').addEventListener('click', () => {
  $('sidebar').classList.toggle('open');
});

// ===== API Helpers =====
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

// ===== Order Select Dropdowns =====
function fillOrderSelects(orders) {
  const options = orders
    .map(o => `<option value="${o.id}">${o.item} — ${o.customerName} (${o.status})</option>`)
    .join('');
  for (const id of ['rpcOrderSelect', 'chatOrderSelect']) {
    const el = $(id);
    const prev = el.value;
    el.innerHTML = options;
    if (prev) el.value = prev;
  }
}

let catalogData = [];

// ===== Dashboard Stats =====
function updateStats(orders) {
  $('statTotal').textContent = orders.length;
  $('statProcessing').textContent = orders.filter(o => o.status === 'processing').length;
  $('statDelivered').textContent = orders.filter(o => o.status === 'delivered').length;
  
  // Calculate Revenue (only for delivered or processing, but let's do all non-cancelled)
  let revenue = 0;
  orders.forEach(o => {
    if (o.status !== 'cancelled') {
      const product = catalogData.find(c => c.name === o.item);
      if (product) revenue += product.price;
    }
  });
  $('statRevenue').textContent = '$' + revenue.toFixed(2);
}

// ===== Render Recent Orders (Dashboard) =====
function renderRecentOrders(orders) {
  const recent = orders.slice(0, 5);
  $('recentOrdersList').innerHTML = recent.map(o => {
    const product = catalogData.find(c => c.name === o.item);
    const priceStr = product ? ` <span style="color:var(--green); font-weight:bold;">$${product.price.toFixed(2)}</span>` : '';
    return `
    <li style="justify-content: space-between;">
      <div style="display:flex; align-items:center; gap: 12px;">
        <span class="status-pill status-${o.status}"><i class="fas fa-circle" style="font-size:0.4rem"></i> ${o.status}</span>
        <span><strong>${o.item}</strong> — ${o.customerName}${priceStr}</span>
      </div>
      <span style="color:var(--text-muted);font-size:0.75rem;font-family:var(--font-mono)">#${o.id.slice(0,8)}</span>
    </li>
  `}).join('');
}

// ===== Render Orders Table =====
function renderOrdersTable(orders) {
  const search = $('orderSearch').value.toLowerCase();
  const filter = $('statusFilter').value;
  let filtered = orders;
  if (filter !== 'all') filtered = filtered.filter(o => o.status === filter);
  if (search) filtered = filtered.filter(o =>
    o.customerName.toLowerCase().includes(search) ||
    o.item.toLowerCase().includes(search) ||
    o.id.toLowerCase().includes(search)
  );

  $('orderTableBody').innerHTML = filtered.map(o => {
    const date = new Date(o.createdAt).toLocaleString();
    const product = catalogData.find(c => c.name === o.item);
    const priceStr = product ? `<span style="color:var(--green); font-weight:600;">$${product.price.toFixed(2)}</span>` : '-';
    
    return `<tr>
      <td style="font-family:var(--font-mono);font-size:0.78rem;color:var(--text-muted)">#${o.id.slice(0,8)}</td>
      <td style="font-weight: 500;">${o.customerName}</td>
      <td>${o.item}</td>
      <td>${priceStr}</td>
      <td><span class="status-pill status-${o.status}"><i class="fas fa-circle" style="font-size:0.35rem"></i> ${o.status}</span></td>
      <td style="font-size:0.8rem;color:var(--text-muted)">${date}</td>
    </tr>`;
  }).join('');
}

// ===== Render Status Timeline =====
function renderTimeline(orders) {
  const orderId = $('rpcOrderSelect').value;
  const order = orders.find(o => o.id === orderId);
  const steps = ['placed', 'processing', 'shipped', 'delivered'];
  const timeline = $('statusTimeline');
  if (!order) { timeline.innerHTML = ''; return; }

  const currentIdx = steps.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';
  let html = '';
  steps.forEach((step, i) => {
    let cls = '';
    if (isCancelled) cls = '';
    else if (i < currentIdx) cls = 'done';
    else if (i === currentIdx) cls = 'active';
    const icons = { placed: 'fa-receipt', processing: 'fa-cog', shipped: 'fa-truck', delivered: 'fa-check' };
    html += `<div class="timeline-step ${cls}">
      <div class="timeline-dot"><i class="fas ${icons[step]}"></i></div>
      <span class="timeline-label">${step}</span>
    </div>`;
    if (i < steps.length - 1) {
      html += `<div class="timeline-connector ${i < currentIdx && !isCancelled ? 'done' : ''}"></div>`;
    }
  });
  if (isCancelled) {
    html += `<div class="timeline-connector"></div>`;
    html += `<div class="timeline-step active"><div class="timeline-dot" style="background:var(--red);border-color:var(--red);color:white"><i class="fas fa-times"></i></div><span class="timeline-label" style="color:var(--red)">Cancelled</span></div>`;
  }
  timeline.innerHTML = html;
}

// ===== Main Render =====
function renderOrders(orders) {
  allOrders = orders;
  updateStats(orders);
  renderRecentOrders(orders);
  renderOrdersTable(orders);
  fillOrderSelects(orders);
  renderTimeline(orders);
}

// ===== Activity Feed =====
function addActivity(text, color = 'blue') {
  const li = document.createElement('li');
  const time = new Date().toLocaleTimeString();
  li.innerHTML = `<span class="activity-dot ${color}"></span><span>${text}</span><span style="margin-left:auto;font-size:0.7rem;color:var(--text-muted)">${time}</span>`;
  $('activityFeed').prepend(li);
  // Keep max 20
  const items = $('activityFeed').children;
  while (items.length > 20) items[items.length - 1].remove();
}

// ===== Alerts =====
function addAlert(text) {
  $('alertsEmpty').style.display = 'none';
  const li = document.createElement('li');
  const time = new Date().toLocaleTimeString();
  li.innerHTML = `
    <div class="alert-icon"><i class="fas fa-bell"></i></div>
    <div class="alert-content">
      <div>${text}</div>
      <div class="alert-time">${time}</div>
    </div>
  `;
  $('alertsList').prepend(li);
}

$('clearAlertsBtn').addEventListener('click', () => {
  $('alertsList').innerHTML = '';
  $('alertsEmpty').style.display = 'block';
});

// ===== Chat =====
function addChatLine(html, cls = '') {
  const div = document.createElement('div');
  div.className = `chat-msg ${cls}`;
  div.innerHTML = html;
  $('chatLog').appendChild(div);
  $('chatLog').scrollTop = $('chatLog').scrollHeight;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Search & Filter =====
if ($('orderSearch')) $('orderSearch').addEventListener('input', () => renderOrdersTable(allOrders));
if ($('statusFilter')) $('statusFilter').addEventListener('change', () => renderOrdersTable(allOrders));

// ===== REST: Catalog + Orders =====
async function loadCatalog() {
  const { data } = await apiGet('/api/v1/catalog');
  catalogData = data;
  $('itemSelect').innerHTML = data.map(c => `<option value="${c.name}">${c.name} — \$${c.price}</option>`).join('');
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
  
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#8B5CF6', '#10B981']
    });
  }
  
  showToast(`Order placed for ${customerName}!`, 'success');
  addActivity(`New order: ${item} for ${customerName}`, 'green');
  await loadOrders();
});

$('advanceBtn').addEventListener('click', async () => {
  const orderId = $('rpcOrderSelect').value;
  const status = $('progressStatus').value;
  if (!orderId) return;
  await apiPatch(`/api/v1/orders/${orderId}/status`, { status });
  showToast(`Status updated to ${status}`, 'success');
  addActivity(`Order #${orderId.slice(0,8)} → ${status}`, 'yellow');
  await loadOrders();
});

// ===== JSON-RPC 2.0 =====
$('cancelBtn').addEventListener('click', async () => {
  const orderId = $('rpcOrderSelect').value;
  if (!orderId) return;
  const result = await rpcCall('cancelOrder', { orderId });
  $('rpcOutput').textContent = JSON.stringify(result, null, 2);
  showToast('Order cancelled', 'error');
  addActivity(`Order #${orderId.slice(0,8)} cancelled`, 'red');
  await loadOrders();
});

$('statusBtn').addEventListener('click', async () => {
  const orderId = $('rpcOrderSelect').value;
  if (!orderId) return;
  const result = await rpcCall('getOrderStatus', { orderId });
  $('rpcOutput').textContent = JSON.stringify(result, null, 2);
  showToast('Status retrieved', 'info');
});

// Update timeline when order selection changes
$('rpcOrderSelect').addEventListener('change', () => renderTimeline(allOrders));

// ===== Socket.io =====
function connectSocket() {
  if (socket) socket.disconnect();
  const role = $('roleSelect').value;
  socket = io(API_BASE, { query: { role, name: role === 'support' ? 'Support' : 'Customer' } });

  socket.on('connect', () => setBadge('wsStatus', true, 'WS'));
  socket.on('disconnect', () => setBadge('wsStatus', false, 'WS'));

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
    addActivity(`Order #${update.orderId.slice(0,8)} updated to ${update.status}`, 'purple');
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
  showToast('Joined chat room', 'info');
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

// ===== SSE =====
function connectSSE() {
  const es = new EventSource(`${API_BASE}/events`);
  es.addEventListener('connected', () => setBadge('sseStatus', true, 'SSE'));
  es.addEventListener('alert', (e) => {
    const data = JSON.parse(e.data);
    addAlert(`📢 [${data.type}] ${data.message}`);
    addActivity(`Alert: ${data.message}`, 'blue');
  });
  es.onerror = () => setBadge('sseStatus', false, 'SSE');
}

function setBadge(id, ok, label) {
  const el = $(id);
  const icon = id === 'wsStatus' ? 'fa-plug' : 'fa-satellite-dish';
  el.innerHTML = `<i class="fas ${icon}"></i> ${label}`;
  el.className = `badge ${ok ? 'badge-on' : 'badge-off'}`;
}

// ===== Backend URL Config =====
$('apiBaseInput').value = API_BASE;
$('saveBaseBtn').addEventListener('click', () => {
  const val = $('apiBaseInput').value.trim().replace(/\/$/, '');
  if (!val) return;
  localStorage.setItem('apiBase', val);
  showToast('API URL saved. Reloading...', 'success');
  setTimeout(() => location.reload(), 1000);
});

// ===== Init =====
(async function init() {
  try {
    await loadCatalog();
    await loadOrders();
    connectSocket();
    connectSSE();
    showToast('Dashboard loaded successfully!', 'success');
  } catch (err) {
    showToast('Failed to connect to backend', 'error');
  }
})();
