import axios from 'axios';

const TOKEN_KEY = 'hrms_auth_token';

const api = axios.create({
  baseURL: 'http://localhost:8001/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearStoredToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
