// app.js - API helper used by pages
// EDIT THIS: set this to match your backend origin (include port)
const API_BASE = "http://localhost:3000";

// helper to talk to backend with credentials included (HTTP-only cookie)
async function apiCall(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {}
  };

  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  // Include credentials so cookies (HTTP-only token) are sent/received
  opts.credentials = 'include';

  const res = await fetch(API_BASE + path, opts);

  // If backend returns 204 No Content
  if (res.status === 204) return {};

  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { message: text }; }

  if (!res.ok) {
    // Attach status for better error handling
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

// small helper to avoid XSS in profile rendering
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
