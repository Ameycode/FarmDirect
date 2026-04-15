import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/api/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          error.config.headers.Authorization = `Bearer ${data.access}`;
          return axios(error.config);
        } catch {
          localStorage.clear();
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (phone: string) => api.post('/api/auth/login/', { phone }),
  register: (data: { phone: string; name: string; role: string }) => api.post('/api/auth/register/', data),
  me: () => api.get('/api/auth/me/'),
  updateProfile: (data: Partial<{ name: string; language: string }>) => api.patch('/api/auth/me/', data),
};

// Farms
export const farmsAPI = {
  list: (params?: { lat?: number; lng?: number; radius?: number; search?: string }) =>
    api.get('/api/farms/', { params }),
  get: (id: number) => api.get(`/api/farms/${id}/`),
  mine: () => api.get('/api/farms/mine/'),
  createOrUpdate: (data: object) => api.post('/api/farms/mine/', data),
  reviews: (id: number) => api.get(`/api/farms/${id}/reviews/`),
  addReview: (id: number, data: { rating: number; comment: string }) =>
    api.post(`/api/farms/${id}/add_review/`, data),
};

// Products
export const productsAPI = {
  list: (params?: { farm_id?: number; category?: string; search?: string }) =>
    api.get('/api/products/', { params }),
  get: (id: number) => api.get(`/api/products/${id}/`),
  mine: () => api.get('/api/products/mine/'),
  create: (data: object) => api.post('/api/products/', data),
  update: (id: number, data: object) => api.patch(`/api/products/${id}/`, data),
  delete: (id: number) => api.delete(`/api/products/${id}/`),
};

// Cart
export const cartAPI = {
  get: () => api.get('/api/orders/cart/'),
  add: (productId: number, quantity: number, negotiatedPrice?: number) =>
    api.post('/api/orders/cart/add/', { product_id: productId, quantity, negotiated_price: negotiatedPrice }),
  updateItem: (itemId: number, quantity: number) => api.patch(`/api/orders/cart/${itemId}/`, { quantity }),
  removeItem: (itemId: number) => api.delete(`/api/orders/cart/${itemId}/`),
  clear: () => api.delete('/api/orders/cart/clear/'),
};

// Orders
export const ordersAPI = {
  place: (data: object) => api.post('/api/orders/', data),
  list: () => api.get('/api/orders/'),
  get: (id: number) => api.get(`/api/orders/${id}/`),
  farmerOrders: (status?: string) => api.get('/api/orders/farmer/', { params: { status } }),
  updateStatus: (id: number, status: string) => api.patch(`/api/orders/${id}/status/`, { status }),
  earnings: () => api.get('/api/orders/farmer/earnings/'),
};

// Negotiations
export const negotiationsAPI = {
  start: (productId: number, offerPrice: number, message?: string) =>
    api.post('/api/negotiations/start/', { product_id: productId, offer_price: offerPrice, message: message || '' }),
  list: (status?: string) =>
    api.get('/api/negotiations/', { params: status ? { status } : {} }),
  detail: (id: number) =>
    api.get(`/api/negotiations/${id}/`),
  sendMessage: (id: number, data: { message?: string; price_offer?: number; message_type: string }) =>
    api.post(`/api/negotiations/${id}/message/`, data),
  accept: (id: number) =>
    api.post(`/api/negotiations/${id}/accept/`),
  reject: (id: number, reason?: string) =>
    api.post(`/api/negotiations/${id}/reject/`, { reason: reason || 'Negotiation declined' }),
  poll: (id: number, after?: string) =>
    api.get(`/api/negotiations/${id}/poll/`, { params: after ? { after } : {} }),
};
