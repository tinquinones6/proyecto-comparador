import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavoritosContext } from '../context/FavoritosContext';
import '../styles/favorito-button.css';

const FavoritoButton = ({ repuesto, size = 'normal', showText = false, className = '' }) => {
  const { esFavorito, toggleFavorito, loading } = useFavoritosContext();
  const token = localStorage.getItem('token');

  // No mostrar el botón si no hay usuario autenticado
  if (!token) {
    return null;
  }

  const handleClick = (e) => {
    e.preventDefault(); // Evitar navegación si está dentro de un link
    e.stopPropagation(); // Evitar eventos de padres
    if (loading) return;
    toggleFavorito(repuesto);
  };

  const esFav = esFavorito(repuesto.id_repuesto || repuesto.id);
  const sizeClass = size === 'small' ? 'favorito-btn-small' : 'favorito-btn-normal';

  return (
    <button
      className={`favorito-btn ${sizeClass} ${esFav ? 'favorito-btn-active' : ''} ${className}`}
      onClick={handleClick}
      disabled={loading}
      title={esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-label={esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {esFav ? (
        <FaHeart className="favorito-icon favorito-icon-filled" />
      ) : (
        <FaRegHeart className="favorito-icon favorito-icon-empty" />
      )}
      {showText && (
        <span className="favorito-text">
          {esFav ? 'Favorito' : 'Favorito'}
        </span>
      )}
    </button>
  );
};

export default FavoritoButton;
