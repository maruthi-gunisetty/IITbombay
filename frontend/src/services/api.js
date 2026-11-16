import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('propwise_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear invalid token if not already on public/auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') && window.location.pathname !== '/') {
        localStorage.removeItem('propwise_token');
        localStorage.removeItem('propwise_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
};

export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/overview'),
};

export const propertiesAPI = {
  list: (params) => api.get('/properties', { params }),
  get: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  delete: (id) => api.delete(`/properties/${id}`),
};

export const valuationAPI = {
  predict: (data) => api.post('/valuation/predict', data),
  history: (params) => api.get('/valuation/history', { params }),
};

export const loansAPI = {
  list: (params) => api.get('/loans', { params }),
  get: (id) => api.get(`/loans/${id}`),
  apply: (data) => api.post('/loans', data),
  review: (id, data) => api.patch(`/loans/${id}/review`, data),
};

export const riskAPI = {
  list: () => api.get('/risk'),
  get: (id) => api.get(`/risk/${id}`),
  analyze: (payload) => api.post('/risk/analyze', payload),
};

export const documentsAPI = {
  list: (params) => api.get('/documents', { params }),
  get: (id) => api.get(`/documents/${id}`),
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/documents/${id}`),
};

export const fraudAPI = {
  listAlerts: (params) => api.get('/fraud/alerts', { params }),
  getStats: () => api.get('/fraud/stats'),
  getAlert: (id) => api.get(`/fraud/alerts/${id}`),
  updateAlert: (id, data) => api.patch(`/fraud/alerts/${id}`, data),
};

export const marketAPI = {
  getAnalytics: (params) => api.get('/market/analytics', { params }),
};

export const reportsAPI = {
  list: (params) => api.get('/reports', { params }),
  generate: (data) => api.post('/reports', data),
  getDownloadUrl: (id) => `/api/reports/${id}/download`,
};

export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  listConversations: () => api.get('/ai/conversations'),
  getMessages: (id) => api.get(`/ai/conversations/${id}/messages`),
  getKeyStatus: () => api.get('/ai/keys/status'),
  validateKey: (apiKey) => api.post('/ai/keys/validate', { api_key: apiKey }),
  saveKey: (apiKey) => api.post('/ai/keys', { api_key: apiKey }),
  deleteKey: () => api.delete('/ai/keys'),
  updatePreferences: (data) => api.patch('/ai/keys/preferences', data),
  getUsage: () => api.get('/ai/usage'),
};

export const adminAPI = {
  getOverview: () => api.get('/admin/overview'),
  listUsers: (params) => api.get('/admin/users', { params }),
  updateRole: (id, account_type) => api.patch(`/admin/users/${id}/role`, { account_type }),
  toggleStatus: (id, is_active) => api.patch(`/admin/users/${id}/status`, { is_active }),
  listAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
};

export const notificationsAPI = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
};

export const complianceAPI = {
  listConsents: () => api.get('/compliance/consents'),
  getGovernance: () => api.get('/compliance/governance'),
};

export default api;
