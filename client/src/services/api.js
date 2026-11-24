let rawBase = (import.meta.env.VITE_API_BASE_URL || '/api').trim();
// Strip trailing slash
rawBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

// Automatically append /api if user provided host without /api (e.g. https://phishguard.onrender.com)
if (rawBase && !rawBase.endsWith('/api')) {
  rawBase = `${rawBase}/api`;
}

const API_BASE = rawBase;

/**
 * Helper to execute fetch requests with automatic token headers and error handling.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('phishguard_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Prevent duplicate /api/api if endpoint already included /api
  if (API_BASE.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    cleanEndpoint = cleanEndpoint.slice(4);
  }
  const requestUrl = `${API_BASE}${cleanEndpoint}`;

  try {
    const response = await fetch(requestUrl, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      // Token invalid or expired - trigger cleanup
      localStorage.removeItem('phishguard_token');
      localStorage.removeItem('phishguard_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login?expired=1';
      }
    }
    throw err;
  }
}

// Authentication APIs
export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  logout: () => request('/auth/logout', { method: 'POST' }),
};

// Scan APIs
export const scanApi = {
  scanUrl: (url) => request('/scan/url', { method: 'POST', body: JSON.stringify({ url }) }),
  scanEmail: (content) => request('/scan/email', { method: 'POST', body: JSON.stringify({ content }) }),
  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/scan/history?${query}`, { method: 'GET' });
  },
  getScanById: (id) => request(`/scan/${id}`, { method: 'GET' }),
  deleteScan: (id) => request(`/scan/${id}`, { method: 'DELETE' }),
};

// Dashboard APIs
export const dashboardApi = {
  getStats: () => request('/dashboard/stats', { method: 'GET' }),
  getActivity: () => request('/dashboard/activity', { method: 'GET' }),
  getThreatDistribution: () => request('/dashboard/threat-distribution', { method: 'GET' }),
};

// Alert APIs
export const alertApi = {
  getAlerts: () => request('/alerts', { method: 'GET' }),
  markAsRead: (id) => request(`/alerts/${id}/read`, { method: 'PATCH' }),
  markAllAsRead: () => request('/alerts/mark-all-read', { method: 'POST' }),
  deleteAlert: (id) => request(`/alerts/${id}`, { method: 'DELETE' }),
};

// User Profile APIs
export const userApi = {
  getProfile: () => request('/users/profile', { method: 'GET' }),
  updateProfile: (body) => request('/users/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  changePassword: (body) => request('/users/change-password', { method: 'PATCH', body: JSON.stringify(body) }),
  deleteAccount: () => request('/users/account', { method: 'DELETE' }),
};

// Threat Intel APIs
export const threatIntelApi = {
  getStatus: () => request('/threat-intel/status', { method: 'GET' }),
  lookup: (url) => request('/threat-intel/lookup', { method: 'POST', body: JSON.stringify({ url }) }),
};

