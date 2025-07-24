import '../styles/admin-new.css';
import { useState, useEffect } from 'react';
import api from '../config/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaPlus, 
  FaComments, 
  FaEdit, 
  FaTrash, 
  FaSync, 
  FaList, 
  FaTh,
  FaCog,
  FaStop,
  FaCar,
  FaBolt,
  FaTools,
  FaWrench,
  FaSnowflake,
  FaFilter,
  FaWind,
  FaPalette,
  FaBoxes
} from 'react-icons/fa';

function AdminPanel() {
  const rol = localStorage.getItem('rol');
  const navigate = useNavigate();
  const [repuestos, setRepuestos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [estadisticasCategorias, setEstadisticasCategorias] = useState({});
  const [cargandoEstadisticas, setCargandoEstadisticas] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [vistaActual, setVistaActual] = useState('categorias'); // 'categorias' o 'repuestos'
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    nombre: '',
    marca: '',
    modelo: '',
    categoria: ''
  });
  const [repuestosFiltrados, setRepuestosFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [repuestosPorPagina] = useState(20);

  // Calcular repuestos para la página actual
  const indiceUltimo = paginaActual * repuestosPorPagina;
  const indicePrimero = indiceUltimo - repuestosPorPagina;
  const repuestosPagina = repuestosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(repuestosFiltrados.length / repuestosPorPagina);

  // Función para obtener el icono apropiado según la categoría
  const getCategoryIcon = (categoria) => {
    switch (categoria) {
      case 'Motor':
        return <FaCog />;
      case 'Frenos':
        return <FaStop />;
      case 'Carrocería':
        return <FaCar />;
      case 'Sistema eléctrico':
        return <FaBolt />;
      case 'Suspensión y dirección':
        return <FaTools />;
      case 'Transmisión':
        return <FaWrench />;
      case 'Enfriamiento':
        return <FaSnowflake />;
      case 'Filtros':
        return <FaFilter />;
      case 'Sistema de escape':
        return <FaWind />;
      case 'Accesorios':
        return <FaPalette />;
      default:
        return <FaBoxes />;
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (categorias.length > 0 && !cargandoEstadisticas && Object.keys(estadisticasCategorias).length === 0) {
      cargarEstadisticasCategorias();
    }
  }, [categorias, cargandoEstadisticas, estadisticasCategorias]);

  useEffect(() => {
    if (vistaActual === 'repuestos' && categoriaSeleccionada) {
      cargarRepuestosPorCategoria(categoriaSeleccionada);
    }
  }, [vistaActual, categoriaSeleccionada]);

  useEffect(() => {
    filtrarRepuestos();
  }, [repuestos, filtros]);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      // Usar endpoint específico para categorías si existe, sino obtener categorías únicas
      try {
        const response = await api.get('/repuestos/categorias');
        setCategorias(response.data.sort());
      } catch (endpointError) {
        // Fallback: obtener todas las categorías únicas de repuestos (solo una muestra pequeña)
        const response = await api.get('/repuestos?limit=1000');
        const categoriasUnicas = [...new Set(response.data.map(r => r.categoria))].filter(Boolean).sort();
        setCategorias(categoriasUnicas);
      }
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticasCategorias = async () => {
    try {
      setCargandoEstadisticas(true);
      // Cargar estadísticas básicas de cada categoría de manera eficiente
      const estadisticas = {};
      
      // Cargar estadísticas de manera paralela para mejorar performance
      const promesasEstadisticas = categorias.map(async (categoria) => {
        try {
          const response = await api.get(`/repuestos?categoria=${encodeURIComponent(categoria)}&limit=1000`);
          const repuestosCategoria = response.data;
          
          return {
            categoria,
            stats: {
              total: repuestosCategoria.length,
              marcas: [...new Set(repuestosCategoria.map(r => r.marca))].length,
              tiendas: [...new Set(repuestosCategoria.map(r => r.tienda))].length,
              precioPromedio: repuestosCategoria.length > 0 
                ? (repuestosCategoria.reduce((sum, r) => sum + parseFloat(r.precio || 0), 0) / repuestosCategoria.length).toFixed(0)
                : 0
            }
          };
        } catch (error) {
          return {
            categoria,
            stats: { total: 0, marcas: 0, tiendas: 0, precioPromedio: 0 }
          };
        }
      });
      
      const resultados = await Promise.all(promesasEstadisticas);
      
      resultados.forEach(({ categoria, stats }) => {
        estadisticas[categoria] = stats;
      });
      
      setEstadisticasCategorias(estadisticas);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setCargandoEstadisticas(false);
    }
  };

  const cargarRepuestosPorCategoria = async (categoria) => {
    try {
      setLoading(true);
      const response = await api.get(`/repuestos?categoria=${encodeURIComponent(categoria)}`);
      setRepuestos(response.data);
    } catch (err) {
      console.error('Error al cargar repuestos:', err);
      toast.error('Error al cargar los repuestos');
    } finally {
      setLoading(false);
    }
  };

  const filtrarRepuestos = () => {
    let resultados = [...repuestos];
    if (filtros.nombre) {
      resultados = resultados.filter(r =>
        r.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
      );
    }
    if (filtros.marca) {
      resultados = resultados.filter(r =>
        r.marca.toLowerCase().includes(filtros.marca.toLowerCase())
      );
    }
    if (filtros.modelo) {
      resultados = resultados.filter(r =>
        r.modelo.toLowerCase().includes(filtros.modelo.toLowerCase())
      );
    }
    if (filtros.categoria) {
      resultados = resultados.filter(r =>
        r.categoria.toLowerCase().includes(filtros.categoria.toLowerCase())
      );
    }
    setRepuestosFiltrados(resultados);
    setPaginaActual(1); // Resetear a la primera página cuando se filtran
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este repuesto?')) return;
    try {
      await api.delete(`/repuestos/${id}`);
      setRepuestos(repuestos.filter(r => r.id !== id));
      toast.success('Repuesto eliminado correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar el repuesto');
    }
  };

  const handleCategoriaClick = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setVistaActual('repuestos');
    setFiltros({
      nombre: '',
      marca: '',
      modelo: '',
      categoria: categoria
    });
  };

  const volverACategorias = () => {
    setVistaActual('categorias');
    setCategoriaSeleccionada('');
    setRepuestos([]);
    setPaginaActual(1);
    setFiltros({
      nombre: '',
      marca: '',
      modelo: '',
      categoria: ''
    });
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setPaginaActual(1);
    setFiltros({
      nombre: '',
      marca: '',
      modelo: '',
      categoria: categoriaSeleccionada
    });
  };

  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (rol !== 'admin') {
    return (
      <div className="admin-container">
        <div className="admin-card">
          <h2>Acceso denegado</h2>
          <p>Solo los administradores pueden acceder a esta página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">Panel de Administración</h1>
        <div className="admin-actions">
          <Link to="/admin/repuesto/nuevo" className="admin-btn admin-btn-primary">
            <FaPlus /> Agregar Repuesto
          </Link>
          <Link to="/admin/comments" className="admin-btn admin-btn-secondary">
            <FaComments /> Gestionar Comentarios
          </Link>
        </div>
      </div>

      {/* Navigation */}
      {vistaActual === 'repuestos' && (
        <div className="admin-navigation">
          <button onClick={volverACategorias} className="admin-btn admin-btn-outline">
            <FaTh /> Volver a Categorías
          </button>
          <span className="admin-breadcrumb">
            Categorías / {categoriaSeleccionada}
          </span>
        </div>
      )}

      {loading && (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      )}

      {/* Vista de Categorías */}
      {vistaActual === 'categorias' && !loading && (
        <div className="admin-content">
          <div className="admin-section">
            <h2 className="admin-section-title">
              <FaTh /> Categorías de Repuestos
            </h2>
            <p className="admin-section-subtitle">
              Selecciona una categoría para gestionar sus repuestos
            </p>
            
            <div className="categories-grid">
              {categorias.map((categoria) => {
                const stats = estadisticasCategorias[categoria] || { total: 0, marcas: 0, tiendas: 0, precioPromedio: 0 };
                return (
                  <div
                    key={categoria}
                    className="category-card"
                    onClick={() => handleCategoriaClick(categoria)}
                  >
                    <div className="category-icon">
                      {getCategoryIcon(categoria)}
                    </div>
                    <h3 className="category-name">{categoria}</h3>
                    
                    {/* Estadísticas de la categoría */}
                    <div className="category-stats">
                      {cargandoEstadisticas ? (
                        <div className="stats-loading">
                          <div className="stats-spinner"></div>
                          <span>Cargando...</span>
                        </div>
                      ) : (
                        <>
                          <div className="stat-item">
                            <span className="stat-number">{stats.total}</span>
                            <span className="stat-label">Repuestos</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-number">{stats.marcas}</span>
                            <span className="stat-label">Marcas</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-number">{stats.tiendas}</span>
                            <span className="stat-label">Tiendas</span>
                          </div>
                          {stats.precioPromedio > 0 && (
                            <div className="stat-item">
                              <span className="stat-number">${Number(stats.precioPromedio).toLocaleString()}</span>
                              <span className="stat-label">Precio Prom.</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Vista de Repuestos */}
      {vistaActual === 'repuestos' && !loading && (
        <div className="admin-content">
          {/* Filtros */}
          <div className="admin-section">
            <h3 className="admin-section-subtitle">
              <FaList /> Filtrar Repuestos - {categoriaSeleccionada}
            </h3>
            <div className="filters-grid">
              <input 
                name="nombre" 
                value={filtros.nombre} 
                onChange={handleFiltroChange} 
                placeholder="Filtrar por nombre" 
                className="admin-input" 
              />
              <input 
                name="marca" 
                value={filtros.marca} 
                onChange={handleFiltroChange} 
                placeholder="Filtrar por marca" 
                className="admin-input" 
              />
              <input 
                name="modelo" 
                value={filtros.modelo} 
                onChange={handleFiltroChange} 
                placeholder="Filtrar por modelo" 
                className="admin-input" 
              />
              <button onClick={limpiarFiltros} className="admin-btn admin-btn-outline">
                <FaSync /> Limpiar filtros
              </button>
            </div>
          </div>

          {/* Tabla de Repuestos */}
          <div className="admin-section">
            <div className="admin-section-title">
              <h3 style={{ margin: 0, color: 'var(--text-color)' }}>
                Repuestos de {categoriaSeleccionada}
              </h3>
              <span className="admin-breadcrumb">
                {repuestosFiltrados.length} resultado{repuestosFiltrados.length !== 1 ? 's' : ''} encontrado{repuestosFiltrados.length !== 1 ? 's' : ''}
                {totalPaginas > 1 && ` • Página ${paginaActual} de ${totalPaginas}`}
              </span>
            </div>
            
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Precio</th>
                    <th>Tienda</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {repuestosPagina.map(repuesto => (
                    <tr key={repuesto.id}>
                      <td className="table-cell-name" title={repuesto.nombre}>
                        {repuesto.nombre}
                      </td>
                      <td>{repuesto.marca}</td>
                      <td>{repuesto.modelo}</td>
                      <td className="table-cell-price">${Number(repuesto.precio).toLocaleString()}</td>
                      <td>{repuesto.tienda}</td>
                      <td className="table-cell-actions">
                        <button 
                          onClick={() => navigate(`/admin/repuesto/${repuesto.id}`)} 
                          className="admin-btn-icon admin-btn-edit"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(repuesto.id)} 
                          className="admin-btn-icon admin-btn-delete"
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {repuestosFiltrados.length === 0 && (
                <div className="admin-empty-state">
                  <p>No se encontraron repuestos en esta categoría</p>
                </div>
              )}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="pagination-container">
                <div className="pagination">
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="pagination-btn"
                  >
                    ‹ Anterior
                  </button>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                      let pageNumber;
                      if (totalPaginas <= 5) {
                        pageNumber = i + 1;
                      } else if (paginaActual <= 3) {
                        pageNumber = i + 1;
                      } else if (paginaActual >= totalPaginas - 2) {
                        pageNumber = totalPaginas - 4 + i;
                      } else {
                        pageNumber = paginaActual - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => cambiarPagina(pageNumber)}
                          className={`pagination-number ${pageNumber === paginaActual ? 'active' : ''}`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="pagination-btn"
                  >
                    Siguiente ›
                  </button>
                </div>
                
                <div className="pagination-info">
                  Mostrando {indicePrimero + 1}-{Math.min(indiceUltimo, repuestosFiltrados.length)} de {repuestosFiltrados.length} repuestos
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;