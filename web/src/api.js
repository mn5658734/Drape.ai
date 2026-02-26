const API_BASE = '/api';

// Mock data when API is unavailable (e.g. Vercel frontend-only deployment)
const MOCKS = {
  '/weather': { temperature: 24, humidity: 65, condition: 'Sunny', city: 'Mumbai', recommendation: 'Light layers recommended.' },
  '/wardrobe/user-1': { items: [
    { id: '1', category: 'shirt', tags: ['office_wear', 'formal'], imageUrl: 'https://picsum.photos/seed/shirt1/200/250' },
    { id: '2', category: 'pants', tags: ['casual'], imageUrl: 'https://picsum.photos/seed/pants1/200/250' },
    { id: '3', category: 't-shirt', tags: ['summer'], imageUrl: 'https://picsum.photos/seed/tshirt1/200/250' },
    { id: '4', category: 'jeans', tags: ['casual'], imageUrl: 'https://picsum.photos/seed/jeans1/200/250' },
  ]},
  '/outfits/user-1/suggestions': { outfits: [
    { id: '1', aiExplanation: 'Blue shirt + navy pants. Professional look for office.', itemIds: [], occasion: 'office' },
    { id: '2', aiExplanation: 'White tee with jeans - casual weekend look.', itemIds: [], occasion: 'casual_hangout' },
    { id: '3', aiExplanation: 'Black blazer over blue shirt - sharp formal.', itemIds: [], occasion: 'interview' },
  ]},
  '/outfits/user-1/rush-mode': { outfit: { id: '1', aiExplanation: 'Blue shirt + navy pants. Quick & professional!', itemIds: [] }},
  '/donate/partners': { partners: [
    { id: 'ngo-1', name: 'Goonj', city: 'Mumbai' },
    { id: 'ngo-2', name: 'Uday Foundation', city: 'Delhi' },
  ]},
  '/shopping/recommendations': { products: [
    { id: '1', name: 'Blue Formal Shirt', brand: 'Peter England', price: '₹999', originalPrice: '₹1,499', platform: 'Myntra', url: 'https://www.myntra.com', image: 'https://picsum.photos/seed/shirt1/200/250', rating: 4.5 },
    { id: '2', name: 'Navy Slim Fit Trousers', brand: 'Louis Philippe', price: '₹1,299', originalPrice: '₹1,999', platform: 'Flipkart', url: 'https://www.flipkart.com', image: 'https://picsum.photos/seed/pants1/200/250', rating: 4.3 },
    { id: '3', name: 'Brown Leather Formal Shoes', brand: 'Bata', price: '₹1,499', originalPrice: '₹2,199', platform: 'Amazon', url: 'https://www.amazon.in', image: 'https://picsum.photos/seed/shoes1/200/250', rating: 4.6 },
  ]},
};

function getMockForUrl(url) {
  const base = url.split('?')[0];
  for (const [key, val] of Object.entries(MOCKS)) {
    if (base.endsWith(key) || url.includes(key)) return val;
  }
  return null;
}

export async function api(method, url, body, options = {}) {
  const isFormData = body instanceof FormData;
  const opts = {
    method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    ...options,
  };
  if (body && !isFormData) opts.body = JSON.stringify(body);
  if (body && isFormData) opts.body = body;

  try {
    const res = await fetch(`${API_BASE}${url}`, opts);
    const data = await res.json().catch(() => ({}));
    if (res.ok) return data;
  } catch (_) {}

  const mock = getMockForUrl(url);
  if (mock) return mock;
  throw new Error('Request failed');
}

export const get = (url) => api('GET', url);
export const post = (url, body) => api('POST', url, body);
export const put = (url, body) => api('PUT', url, body);
export const del = (url) => api('DELETE', url);

export async function uploadPhoto(userId, file, category = 't-shirt', tags = []) {
  try {
    const fd = new FormData();
    fd.append('photo', file);
    fd.append('category', category);
    if (tags?.length) fd.append('tags', Array.isArray(tags) ? tags.join(',') : tags);
    return await api('POST', `/wardrobe/${userId}/upload`, fd);
  } catch (_) {
    return { id: 'mock-' + Date.now(), userId, category, imageUrl: 'https://picsum.photos/seed/new/200/250', tags: tags || [] };
  }
}
