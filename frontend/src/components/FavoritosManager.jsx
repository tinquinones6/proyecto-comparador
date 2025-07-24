import React from 'react';
import { FaHeart, FaExternalLinkAlt, FaTrash } from 'react-icons/fa';
import { useFavoritosContext } from '../context/FavoritosContext';
import '../styles/favoritos.css';

const FavoritosManager = () => {
  const { favoritos, loading, eliminarFavorito } = useFavoritosContext();

  const handleConsultar = (favorito) => {
    // Usar el link directo del favorito o construir la URL si no existe
    const link = favorito.link || favorito.url;
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      // Si no hay link, mostrar mensaje
      alert('Lo sentimos, el enlace de compra no está disponible para este producto.');
    }
  };

  const handleEliminarFavorito = (favorito) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este favorito?')) {
      eliminarFavorito(favorito.id);
    }
  };

  const formatearPrecio = (precio) => {
    if (!precio) return 'Consultar precio';
    return `$${parseFloat(precio).toLocaleString('es-CL')}`;
  };

  if (loading) {
    return (
      <div className="favoritos-container">
        <div className="favoritos-header">
          <FaHeart className="favoritos-icon" />
          <h2>Mis Repuestos Favoritos</h2>
        </div>
        <div className="favoritos-loading">
          <div className="loading-spinner"></div>
          <p>Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  if (favoritos.length === 0) {
    return (
      <div className="favoritos-container">
        <div className="favoritos-header">
          <FaHeart className="favoritos-icon" />
          <h2>Mis Repuestos Favoritos</h2>
        </div>
        <div className="favoritos-empty">
          <FaHeart className="empty-icon" />
          <h3>No tienes repuestos favoritos</h3>
          <p>Explora nuestro catálogo y guarda los repuestos que te interesen haciendo clic en el corazón</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favoritos-container">
      <div className="favoritos-header">
        <FaHeart className="favoritos-icon" />
        <h2>Mis Repuestos Favoritos</h2>
        <span className="favoritos-count">{favoritos.length} repuesto{favoritos.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="favoritos-grid">
        {favoritos.map((favorito) => (
          <div key={favorito.id} className="favorito-card">
            <div className="favorito-header">
              <h4 className="favorito-title">{favorito.nombre}</h4>
              <button
                className="favorito-remove-btn"
                onClick={() => handleEliminarFavorito(favorito)}
                title="Eliminar de favoritos"
              >
                <FaTrash />
              </button>
            </div>

            <div className="favorito-content">
              <div className="favorito-details">
                <div className="favorito-detail">
                  <span className="favorito-label">Marca:</span>
                  <span className="favorito-value">{favorito.marca || 'No especificada'}</span>
                </div>

                <div className="favorito-detail">
                  <span className="favorito-label">Modelo:</span>
                  <span className="favorito-value">{favorito.modelo || 'No especificado'}</span>
                </div>

                {favorito.año && (
                  <div className="favorito-detail">
                    <span className="favorito-label">Año:</span>
                    <span className="favorito-value">{favorito.año}</span>
                  </div>
                )}

                <div className="favorito-detail">
                  <span className="favorito-label">Categoría:</span>
                  <span className="favorito-value">{favorito.categoria || 'Sin categoría'}</span>
                </div>

                <div className="favorito-detail">
                  <span className="favorito-label">Precio:</span>
                  <span className="favorito-value favorito-price">
                    {formatearPrecio(favorito.precio)}
                  </span>
                </div>
              </div>
              
              <div className="favorito-actions">
                <button
                  onClick={() => handleConsultar(favorito)}
                  className="favorito-consultar-btn-primary"
                >
                  <FaExternalLinkAlt />
                  Consultar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritosManager;
