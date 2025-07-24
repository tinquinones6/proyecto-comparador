import axios from 'axios';
import { API_URL, CONFIG } from './config';

const api = axios.create({
  baseURL: API_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Interceptor de request con mejor logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (import.meta.env.DEV) {
      console.log('🔍 API Request:', {
        url: `${config.baseURL}${config.url}`,
        method: config.method?.toUpperCase(),
        token: token ? `${token.substring(0, 20)}...` : 'No token'
      });
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url
      });
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🚨 Error 401 - Token inválido, limpiando localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      // Redirigir al login si estamos en el navegador
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;