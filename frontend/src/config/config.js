// Configuración de API con detección automática de entorno
const getApiUrl = () => {
  // Si hay variable de entorno específica, usarla
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Detección automática según el hostname
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // FORZAR desarrollo local mientras trabajas en localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('Modo desarrollo local detectado - usando backend local');
    return 'http://localhost:3000/api';
  }
  
  // Si estamos en producción (IP específica)
  if (hostname === '146.83.198.35') {
    // El backend está corriendo en puerto 80 (según tu configuración)
    return `${protocol}//${hostname}:80/api`;
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
  MAX_RETRIES: 3
};

// Log de configuración en desarrollo
if (import.meta.env.DEV) {
  console.log('🔧 Configuración Frontend:', {
    API_URL,
    hostname: window.location.hostname,
    environment: import.meta.env.MODE
  });
}