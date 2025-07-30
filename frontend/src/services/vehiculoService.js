import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Configurar interceptor para incluir token automáticamente
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const vehiculoService = {
  // Obtener vehículos del usuario
  async obtenerVehiculos() {
    try {
      const response = await api.get('/vehiculos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      throw error;
    }
  },

  // Agregar nuevo vehículo
  async agregarVehiculo(vehiculoData) {
    try {
      const response = await api.post('/vehiculos', vehiculoData);
      return response.data;
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      throw error;
    }
  },

  // Actualizar vehículo existente
  async actualizarVehiculo(vehiculoId, vehiculoData) {
    try {
      const response = await api.put(`/vehiculos/${vehiculoId}`, vehiculoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      throw error;
    }
  },

  // Eliminar vehículo
  async eliminarVehiculo(vehiculoId) {
    try {
      const response = await api.delete(`/vehiculos/${vehiculoId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      throw error;
    }
  },

  // Establecer vehículo como principal
  async establecerPrincipal(vehiculoId) {
    try {
      const response = await api.patch(`/vehiculos/${vehiculoId}/principal`);
      return response.data;
    } catch (error) {
      console.error('Error al establecer vehículo principal:', error);
      throw error;
    }
  },

  // Obtener marcas disponibles
  async obtenerMarcas() {
    try {
      const response = await api.get('/vehiculos/marcas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  },

  // Obtener modelos por marca
  async obtenerModelosPorMarca(marca) {
    try {
      const response = await api.get(`/vehiculos/modelos/${encodeURIComponent(marca)}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener modelos:', error);
      throw error;
    }
  }
};
