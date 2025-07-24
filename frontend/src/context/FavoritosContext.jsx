import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { favoritosService } from '../services/favoritosService';
import { toast } from 'react-toastify';

const FavoritosContext = createContext();

export const useFavoritosContext = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritosContext debe usarse dentro de FavoritosProvider');
  }
  return context;
};

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoritosIds, setFavoritosIds] = useState(new Set());
  const [initialized, setInitialized] = useState(false);

  // Cargar favoritos del usuario
  const cargarFavoritos = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    // Evitar múltiples cargas simultáneas
    if (loading || initialized) {
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
      setInitialized(true);
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
  const eliminarFavorito = async (favoritoId) => {
    try {
      console.log('🗑️ Eliminando favorito con ID:', favoritoId);
      
      // Encontrar el favorito antes de eliminarlo para obtener el repuesto_id
      const favorito = favoritos.find(fav => fav.id === favoritoId);
      if (!favorito) {
        console.error('❌ Favorito no encontrado con ID:', favoritoId);
        toast.error('Favorito no encontrado');
        return;
      }
      
      await favoritosService.eliminarFavorito(favoritoId);
      
      // Actualizar el estado local
      setFavoritos(prev => prev.filter(fav => fav.id !== favoritoId));
      
      // Actualizar el set de IDs
      setFavoritosIds(prevIds => {
        const newSet = new Set(prevIds);
        newSet.delete(favorito.repuesto_id);
        return newSet;
      });
      
      console.log('✅ Favorito eliminado correctamente');
      
      toast.success('Repuesto eliminado de favoritos', { 
        autoClose: 2000,
        toastId: `fav-remove-${favoritoId}`
      });
    } catch (error) {
      console.error('❌ Error al eliminar favorito:', error);
      toast.error('Error al eliminar de favoritos');
    }
  };

  // Verificar si un repuesto es favorito
  const esFavorito = (repuestoId) => {
    return favoritosIds.has(repuestoId);
  };

  // Toggle favorito
  const toggleFavorito = async (repuesto) => {
    const { id_repuesto } = repuesto;
    
    if (esFavorito(id_repuesto)) {
      // Encontrar el favorito y eliminarlo
      const favorito = favoritos.find(fav => fav.repuesto_id === id_repuesto);
      if (favorito) {
        await eliminarFavorito(favorito.id);
        // Actualizar el set de IDs
        setFavoritosIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id_repuesto);
          return newSet;
        });
        toast.success('Repuesto eliminado de favoritos', { 
          autoClose: 2000,
          toastId: `fav-remove-${id_repuesto}`
        });
      }
    } else {
      // Agregar a favoritos
      await agregarFavorito(id_repuesto);
    }
  };

  // Inicializar favoritos cuando hay token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !initialized && !loading) {
      cargarFavoritos();
    } else if (!token && !initialized) {
      setInitialized(true);
    }
  }, [initialized, loading]);

  const value = {
    favoritos,
    loading,
    favoritosIds,
    esFavorito,
    agregarFavorito,
    eliminarFavorito,
    toggleFavorito,
    cargarFavoritos,
    initialized
  };

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};
