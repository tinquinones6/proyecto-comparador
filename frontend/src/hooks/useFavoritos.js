import { useState, useEffect, useCallback } from 'react';
import { favoritosService } from '../services/favoritosService';
import { toast } from 'react-toastify';

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritosIds, setFavoritosIds] = useState(new Set());

  // Cargar favoritos del usuario
  const cargarFavoritos = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const favoritosData = await favoritosService.obtenerFavoritos();
      setFavoritos(favoritosData);
      
      // Crear un Set con los IDs de repuestos favoritos para búsqueda rápida
      const ids = new Set(favoritosData.map(fav => fav.repuesto_id));
      setFavoritosIds(ids);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      // Solo mostrar toast si no es un error de autenticación
      if (error.response?.status !== 401 && error.status !== 401) {
        toast.error('Error al cargar favoritos');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar favorito
  const agregarFavorito = async (repuestoId) => {
    try {
      const nuevoFavorito = await favoritosService.agregarFavorito(repuestoId);
      setFavoritosIds(prev => new Set(prev).add(repuestoId));
      // Agregar al estado local sin recargar todo
      setFavoritos(prev => [...prev, nuevoFavorito]);
      toast.success('Repuesto agregado a favoritos', { 
        autoClose: 2000,
        toastId: `fav-add-${repuestoId}`
      });
    } catch (error) {
      console.error('Error al agregar favorito:', error);
      if (error.message === 'Este repuesto ya está en favoritos') {
        toast.info('Este repuesto ya está en tus favoritos');
      } else {
        toast.error('Error al agregar a favoritos');
      }
    }
  };

  // Eliminar favorito
  const eliminarFavorito = async (favoritoId, repuestoId) => {
    try {
      await favoritosService.eliminarFavorito(favoritoId);
      setFavoritosIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(repuestoId);
        return newSet;
      });
      // Eliminar del estado local sin recargar todo
      setFavoritos(prev => prev.filter(fav => fav.id !== favoritoId));
      toast.success('Repuesto eliminado de favoritos', { 
        autoClose: 2000,
        toastId: `fav-remove-${repuestoId}`
      });
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      toast.error('Error al eliminar de favoritos');
    }
  };

  // Verificar si un repuesto es favorito
  const esFavorito = (repuestoId) => {
    return favoritosIds.has(repuestoId);
  };

  // Toggle favorito
  const toggleFavorito = async (repuesto) => {
    console.log('🔍 Debug toggleFavorito:');
    console.log('  - repuesto completo:', repuesto);
    console.log('  - repuesto.id_repuesto:', repuesto.id_repuesto);
    
    const { id_repuesto } = repuesto;
    
    if (esFavorito(id_repuesto)) {
      // Encontrar el favorito y eliminarlo
      const favorito = favoritos.find(fav => fav.repuesto_id === id_repuesto);
      if (favorito) {
        await eliminarFavorito(favorito.id, id_repuesto);
      }
    } else {
      // Agregar a favoritos
      console.log('  - Enviando repuestoId:', id_repuesto);
      await agregarFavorito(id_repuesto);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      cargarFavoritos();
    } else {
      setLoading(false);
    }
  }, []); // Solo ejecutar una vez al montar el componente

  return {
    favoritos,
    loading,
    favoritosIds,
    esFavorito,
    agregarFavorito,
    eliminarFavorito,
    toggleFavorito,
    cargarFavoritos
  };
};
