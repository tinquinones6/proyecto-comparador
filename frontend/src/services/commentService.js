import axios from 'axios';
import { API_URL } from '../config/config';

const COMMENTS_URL = `${API_URL}/comments`;

// Función auxiliar para obtener el token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const commentService = {
  // Crear un nuevo comentario
  createComment: async (sparepartId, message, type) => {
    try {
      const response = await axios.post(COMMENTS_URL, {
        sparepartId,
        message,
        type
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener comentarios de un repuesto específico
  getCommentsBySparepart: async (sparepartId) => {
    try {
      const response = await axios.get(`${COMMENTS_URL}/sparepart/${sparepartId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener todos los comentarios (admin)
  getAllComments: async () => {
    try {
      const response = await axios.get(COMMENTS_URL, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar estado del comentario (admin)
  updateCommentStatus: async (commentId, status) => {
    try {
      const response = await axios.patch(
        `${COMMENTS_URL}/${commentId}`,
        { status },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar un comentario (admin)
  deleteComment: async (commentId) => {
    try {
      const response = await axios.delete(
        `${COMMENTS_URL}/${commentId}`,
        getAuthHeaders()
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en deleteComment:', error);
      throw error.response?.data || { success: false, message: error.message };
    }
  }
}; 