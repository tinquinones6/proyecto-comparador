import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { FaBoxes, FaChevronRight } from 'react-icons/fa';
import '../styles/quick-filters.css';

function QuickFilters() {
  const [tiposPopulares, setTiposPopulares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTiposPopulares();
  }, []);

  const fetchTiposPopulares = async () => {
    try {
      setLoading(true);
      // Obtener todos los tipos ordenados por cantidad
      const categorias = ['Motor', 'Frenos', 'Carrocería', 'Sistema eléctrico'];
      const todosTipos = [];

      for (const categoria of categorias) {
        try {
          const response = await api.get(`/repuestos/tipos/${categoria}`);
          const tiposCategoria = response.data.map(tipo => ({
            ...tipo,
            categoria,
            url: `/categoria/${encodeURIComponent(categoria)}?tipo=${encodeURIComponent(tipo.nombre)}`
          }));
          todosTipos.push(...tiposCategoria);
        } catch (error) {
          console.error(`Error al cargar tipos de ${categoria}:`, error);
        }
      }

      // Ordenar por cantidad y tomar los top 8
      const tiposMasPopulares = todosTipos
        .sort((a, b) => parseInt(b.cantidad) - parseInt(a.cantidad))
        .slice(0, 8);

      setTiposPopulares(tiposMasPopulares);
    } catch (error) {
      console.error('Error al cargar tipos populares:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconoTipo = (nombreTipo) => {
    const iconos = {
      'Correa': '🔗',
      'Bujia': '⚡',
      'Motor': '🔧',
      'Termostato': '🌡️',
      'Distribucion': '⚙️',
      'Bobina': '🔌',
      'Filtro': '🔄',
      'Pastillas': '🛑',
      'Discos': '🔴',
      'Aceite': '🛢️',
      'Batería': '🔋',
      'Faro': '💡',
      'Sensor': '📡'
    };

    for (const [clave, icono] of Object.entries(iconos)) {
      if (nombreTipo.toLowerCase().includes(clave.toLowerCase())) {
        return icono;
      }
    }
    return '🔧';
  };

  if (loading) {
    return (
      <div className="quick-filters-section">
        <h2>Tipos Más Buscados</h2>
        <div className="quick-filters-loading">
          <div className="loading-spinner"></div>
          <p>Cargando tipos populares...</p>
        </div>
      </div>
    );
  }

  if (tiposPopulares.length === 0) {
    return null;
  }

  return (
    <div className="quick-filters-section">
      <div className="quick-filters-header">
        <h2>Tipos Más Buscados</h2>
        <p>Acceso directo a los repuestos más populares</p>
      </div>
      
      <div className="quick-filters-grid">
        {tiposPopulares.map((tipo) => (
          <Link
            key={`${tipo.categoria}-${tipo.id_tipo}`}
            to={tipo.url}
            className="quick-filter-card"
          >
            <div className="quick-filter-icon">
              {getIconoTipo(tipo.nombre)}
            </div>
            <div className="quick-filter-content">
              <div className="quick-filter-name">{tipo.nombre}</div>
              <div className="quick-filter-category">{tipo.categoria}</div>
              <div className="quick-filter-count">{tipo.cantidad} productos</div>
              <div className="quick-filter-price">
                ${Number(tipo.precio_minimo).toLocaleString()} - ${Number(tipo.precio_maximo).toLocaleString()}
              </div>
            </div>
            <div className="quick-filter-arrow">
              <FaChevronRight />
            </div>
          </Link>
        ))}
      </div>
      
      <div className="quick-filters-footer">
        <p>
          <FaBoxes className="inline-icon" />
          Explora todos los tipos disponibles en cada categoría
        </p>
      </div>
    </div>
  );
}

export default QuickFilters;
