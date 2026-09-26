// When frontend is served from the same server as backend, use the same origin.
// Falls back to localhost:4000 if opened as a standalone file.
window.DEFAULT_API_BASE = localStorage.getItem('apiBase') || window.location.origin || 'http://localhost:4000';
