import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { FaCog, FaWrench, FaCar, FaBolt } from 'react-icons/fa';
import '../styles/category-stats.css';

function CategoryStats() {
  const [estadisticas, setEstadisticas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstadisticasCategorias();
  }, []);

  const fetchEstadisticasCategorias = async () => {
    try {
      setLoading(true);
      const categoriasPrincipales = [
        { nombre: 'Motor', icono: FaCog, color: '#dc3545' },
        { nombre: 'Frenos', icono: FaWrench, color: '#fd7e14' },
        { nombre: 'Carrocería', icono: FaCar, color: '#20c997' },
        { nombre: 'Sistema eléctrico', icono: FaBolt, color: '#6f42c1' }
      ];

      const estadisticasPromises = categoriasPrincipales.map(async (categoria) => {
        try {
          const [tiposResponse, repuestosResponse] = await Promise.all([
            api.get(`/repuestos/tipos/${categoria.nombre}`),
            api.get(`/repuestos?categoria=${encodeURIComponent(categoria.nombre)}`)
          ]);
          
          const tipos = tiposResponse.data;
          const repuestos = repuestosResponse.data;
          
          return {
            ...categoria,
            totalTipos: tipos.length,
            totalRepuestos: repuestos.length,
            tipoMasPopular: tipos.length > 0 ? tipos[0] : null,
            marcasUnicas: [...new Set(repuestos.map(r => r.marca))].length
          };
        } catch (error) {
          console.error(`Error al cargar estadísticas de ${categoria.nombre}:`, error);
          return {
            ...categoria,
            totalTipos: 0,
            totalRepuestos: 0,
            tipoMasPopular: null,
            marcasUnicas: 0
          };
        }
      });

      const estadisticasCompletas = await Promise.all(estadisticasPromises);
      setEstadisticas(estadisticasCompletas);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="category-stats-section">
        <h2>Estadísticas por Categoría</h2>
        <div className="category-stats-loading">
          <div className="loading-spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-stats-section">
      <div className="category-stats-header">
        <h2>Resumen por Categoría</h2>
        <p>Descubre la variedad de tipos y opciones en cada categoría</p>
      </div>
      
      <div className="category-stats-grid">
        {estadisticas.map((categoria) => {
          const IconComponent = categoria.icono;
          return (
            <div 
              key={categoria.nombre} 
              className="category-stat-card"
              style={{ '--category-color': categoria.color }}
            >
              <div className="category-stat-header">
                <div className="category-stat-icon">
                  <IconComponent />
                </div>
                <h3>{categoria.nombre}</h3>
              </div>
              
              <div className="category-stat-content">
                <div className="stat-row">
                  <span className="stat-label">Tipos disponibles:</span>
                  <span className="stat-value">{categoria.totalTipos}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Total productos:</span>
                  <span className="stat-value">{categoria.totalRepuestos.toLocaleString()}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Marcas diferentes:</span>
                  <span className="stat-value">{categoria.marcasUnicas}</span>
                </div>
                
                {categoria.tipoMasPopular && (
                  <div className="tipo-popular">
                    <span className="tipo-popular-label">Más popular:</span>
                    <span className="tipo-popular-value">
                      {categoria.tipoMasPopular.nombre} ({categoria.tipoMasPopular.cantidad} productos)
                    </span>
                  </div>
                )}
              </div>
              
              <div className="category-stat-progress">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${Math.min((categoria.totalRepuestos / Math.max(...estadisticas.map(e => e.totalRepuestos))) * 100, 100)}%`,
                    backgroundColor: categoria.color 
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryStats;
