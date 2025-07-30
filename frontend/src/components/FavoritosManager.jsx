import React from 'react';
import { FaHeart, FaExternalLinkAlt, FaTrash } from 'react-icons/fa';
import { useFavoritosContext } from '../context/FavoritosContext';
import { formatearPrecioCLP } from '../utils/priceFormatter';
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
    console.log('Debug eliminar favorito desde FavoritosManager:');
    console.log('  - favorito completo:', favorito);
    console.log('  - favorito.id:', favorito.id);
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este favorito?')) {
      eliminarFavorito(favorito.id);
    }
  };

  const formatearPrecio = (precio) => {
    return formatearPrecioCLP(precio);
  };

  // Función para formatear la fecha de carga
  const formatearFechaCarga = (fechaCarga) => {
    if (!fechaCarga) return 'Fecha no disponible';
    
    const fecha = new Date(fechaCarga);
    const ahora = new Date();
    const diferenciaTiempo = ahora - fecha;
    const diasDiferencia = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
    
    if (diasDiferencia === 0) {
      return 'Hoy';
    } else if (diasDiferencia === 1) {
      return 'Ayer';
    } else if (diasDiferencia < 7) {
      return `Hace ${diasDiferencia} días`;
    } else if (diasDiferencia < 30) {
      const semanas = Math.floor(diasDiferencia / 7);
      return `Hace ${semanas} semana${semanas > 1 ? 's' : ''}`;
    } else if (diasDiferencia < 365) {
      const meses = Math.floor(diasDiferencia / 30);
      return `Hace ${meses} mes${meses > 1 ? 'es' : ''}`;
    } else {
      return fecha.toLocaleDateString('es-CL');
    }
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
                  <span className="favorito-label">Tienda:</span>
                  <span className="favorito-value">{favorito.tienda || 'No especificada'}</span>
                </div>

                {favorito.fecha_carga && (
                  <div className="favorito-detail">
                    <span className="favorito-label">Última actualización:</span>
                    <span className="favorito-value fecha-carga">
                      {formatearFechaCarga(favorito.fecha_carga)}
                    </span>
                  </div>
                )}

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
