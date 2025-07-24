import api from '../config/api';

export const favoritosService = {
  // Obtener todos los favoritos del usuario
  obtenerFavoritos: async () => {
    try {
      const response = await api.get('/favoritos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      throw error.response?.data || { message: 'Error al obtener favoritos' };
    }
  },

  // Agregar un repuesto a favoritos
  agregarFavorito: async (repuestoId) => {
    console.log('🔍 Debug favoritosService.agregarFavorito:');
    console.log('  - repuestoId recibido:', repuestoId);
    console.log('  - typeof repuestoId:', typeof repuestoId);
    
    try {
      const response = await api.post('/favoritos', { repuestoId });
      return response.data;
    } catch (error) {
      console.error('Error al agregar favorito:', error);
      throw error.response?.data || { message: 'Error al agregar favorito' };
    }
  },

  // Eliminar un repuesto de favoritos
  eliminarFavorito: async (favoritoId) => {
    try {
      const response = await api.delete(`/favoritos/${favoritoId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      throw error.response?.data || { message: 'Error al eliminar favorito' };
    }
  },

  // Verificar si un repuesto está en favoritos
  esFavorito: async (repuestoId) => {
    try {
      const favoritos = await this.obtenerFavoritos();
      return favoritos.some(fav => fav.repuesto_id === repuestoId);
    } catch (error) {
      return false;
    }
  }
};
