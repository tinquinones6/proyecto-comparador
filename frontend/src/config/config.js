// Configuración de API con detección automática de entorno
const getApiUrl = () => {
  // Si hay variable de entorno específica, usarla
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Detección automática según el hostname
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;
  
  // Si estamos en producción (IP específica)
  if (hostname === '146.83.198.35') {
    // El backend está en puerto 80
    return `http://146.83.198.35:80/api`;
  }
  
  // Si estamos en desarrollo local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  
  // Fallback por defecto
  return 'http://localhost:3000/api';
};

export const API_URL = getApiUrl();

// Configuración adicional
export const CONFIG = {
  API_URL,
  APP_NAME: 'RepAuto Comparador',
  VERSION: '1.0.0',
  TIMEOUT: 30000, // 30 segundos
  MAX_RETRIES: 3,
  // Configuración de puertos
  PORTS: {
    PRODUCTION: {
      FRONTEND: 1212, // Puerto real del frontend en producción
      BACKEND: 80
    },
    DEVELOPMENT: {
      FRONTEND: 5173,
      BACKEND: 3000
    }
  }
};

// Log de configuración en desarrollo
if (import.meta.env.DEV) {
  console.log('🔧 Configuración Frontend:', {
    API_URL,
    hostname: window.location.hostname,
    port: window.location.port,
    environment: import.meta.env.MODE
  });
}