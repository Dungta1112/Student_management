import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

const getAccessToken = () => localStorage.getItem('access_token');

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refresh = localStorage.getItem('refresh_token');

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url === '/token/' ||
      !refresh
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    refreshPromise ??= axios
      .post('/api/token/refresh/', { refresh })
      .then(({ data }) => {
        localStorage.setItem('access_token', data.access);
        return data.access;
      })
      .finally(() => {
        refreshPromise = null;
      });

    try {
      const access = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${access}`;
      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.dispatchEvent(new Event('auth:expired'));
      return Promise.reject(refreshError);
    }
  },
);

export default api;
