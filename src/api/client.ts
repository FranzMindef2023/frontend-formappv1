import axios from 'axios';
import Cookies from 'js-cookie';

const client = axios.create({
  baseURL: 'http://laravel-appv1.local/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agrega token automáticamente a cada request
client.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Maneja expiración de token automáticamente
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
