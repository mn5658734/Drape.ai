const API_BASE = 'http://localhost:3000/api';

export const api = {
  async get(url) {
    const res = await fetch(`${API_BASE}${url}`);
    return res.json();
  },
  async post(url, body) {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
  async put(url, body) {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
  async delete(url) {
    const res = await fetch(`${API_BASE}${url}`, { method: 'DELETE' });
    return res.json();
  },
};

export default api;
