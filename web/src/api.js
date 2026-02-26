const API_BASE = '/api';

export async function api(method, url, body, options = {}) {
  const isFormData = body instanceof FormData;
  const opts = {
    method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    ...options,
  };
  if (body && !isFormData) opts.body = JSON.stringify(body);
  if (body && isFormData) opts.body = body;
  const res = await fetch(`${API_BASE}${url}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const get = (url) => api('GET', url);
export const post = (url, body) => api('POST', url, body);
export const put = (url, body) => api('PUT', url, body);
export const del = (url) => api('DELETE', url);

export async function uploadPhoto(userId, file, category = 't-shirt') {
  const fd = new FormData();
  fd.append('photo', file);
  fd.append('category', category);
  return api('POST', `/wardrobe/${userId}/upload`, fd);
}
