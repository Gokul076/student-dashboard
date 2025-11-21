import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// attach token automatically
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// response interceptor: auto-logout on 401
api.interceptors.response.use(
  r => r,
  err => {
    if (err?.response?.status === 401) {
      // clear storage and redirect gracefully
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // avoid using window.location in tests; safe navigation:
      try { window.location.href = '/login'; } catch (e) { /* ignore */ }
    }
    return Promise.reject(err);
  }
);

// small helper to verify token by calling /auth/me
export async function verifyToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const res = await api.get('/auth/me');
    return res.data?.user ?? null;
  } catch (e) {
    return null;
  }
}

export default api;
