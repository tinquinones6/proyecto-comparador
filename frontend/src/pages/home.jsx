import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { 
  FaArrowRight, 
  FaBoxes, 
  FaStore, 
  FaTags,
  FaCog,
  FaCar,
  FaBolt,
  FaTools,
  FaWrench,
  FaSnowflake,
  FaFilter,
  FaWind,
  FaPalette,
  FaStop
} from 'react-icons/fa';
import QuickFilters from '../components/QuickFilters';
import CategoryStats from '../components/CategoryStats';
import '../styles/home.css';
import '../styles/category.css';

function Home() {
  const [categorias, setCategorias] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalRepuestos: 0,
    totalTiendas: 0,
    categoriaConMasProductos: '',
    repuestosRecientes: []
  });
  const [loading, setLoading] = useState(true);

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

  // Función para obtener la descripción específica de cada categoría
  const getCategoryDescription = (categoria) => {
    switch (categoria) {
      case 'Motor':
        return 'Repuestos para el motor y sistemas de combustión';
      case 'Frenos':
        return 'Sistemas de frenado y componentes de seguridad';
      case 'Carrocería':
        return 'Elementos externos y estéticos del vehículo';
      case 'Sistema eléctrico':
        return 'Componentes eléctricos y electrónicos';
      case 'Suspensión y dirección':
        return 'Sistemas de manejo y comodidad de conducción';
      case 'Transmisión':
        return 'Componentes de transmisión y embrague';
      case 'Enfriamiento':
        return 'Sistema de refrigeración del motor';
      case 'Filtros':
        return 'Filtros de aire, aceite y combustible';
      case 'Sistema de escape':
        return 'Componentes del sistema de escape';
      case 'Accesorios':
        return 'Complementos y accesorios para tu vehículo';
      default:
        return 'Página dedicada con comparación';
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Obtener categorías
      const categoriasRes = await api.get('/repuestos/categorias');
      setCategorias(categoriasRes.data);
      
      // Obtener todos los repuestos para estadísticas
      const repuestosRes = await api.get('/repuestos');
      const todosRepuestos = repuestosRes.data;
      
      // Calcular estadísticas
      const totalRepuestos = todosRepuestos.length;
      const tiendas = [...new Set(todosRepuestos.map(r => r.tienda))];
      const totalTiendas = tiendas.length;
      
      // Categoría con más productos
      let categoriaConMasProductos = '';
      if (todosRepuestos.length > 0) {
        const categoriasCantidad = {};
        todosRepuestos.forEach(r => {
          if (r.categoria) {
            categoriasCantidad[r.categoria] = (categoriasCantidad[r.categoria] || 0) + 1;
          }
        });
        categoriaConMasProductos = Object.keys(categoriasCantidad).reduce((a, b) => 
          categoriasCantidad[a] > categoriasCantidad[b] ? a : b, ''
        );
      }
      
      // Repuestos más recientes (últimos 3)
      const repuestosRecientes = todosRepuestos.slice(-3).reverse();
      
      setEstadisticas({
        totalRepuestos,
        totalTiendas,
        categoriaConMasProductos,
        repuestosRecientes
      });
      
    } catch (err) {
      console.error('Error al obtener datos del home', err);
    } finally {
      setLoading(false);
    }
  };

  const imagenDefecto = 'https://via.placeholder.com/300x160.png?text=Sin+imagen';

  if (loading) {
    return (
      <div className="home-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando información del sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-content">
      {/* Header principal */}
      <div className="home-header">
        <h1 className="home-title">TuRepuesto.cl - Comparador de Repuestos Automotrices</h1>
        <p className="home-subtitle">
          Encuentra los mejores precios y compara repuestos de diferentes tiendas
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="stats-grid">
        <div className="stats-card">
          <h3>Total de Repuestos</h3>
          <div className="number">{estadisticas.totalRepuestos}</div>
          <div className="label">En nuestro catálogo</div>
        </div>
        <div className="stats-card">
          <h3>Categorías</h3>
          <div className="number">{categorias.length}</div>
          <div className="label">Diferentes categorías</div>
        </div>
        <div className="stats-card">
          <h3>Tiendas</h3>
          <div className="number">{estadisticas.totalTiendas}</div>
          <div className="label">Tiendas asociadas</div>
        </div>
      </div>

      {/* Categorías principales */}
      <div className="categories-main-section">
        <h2>Explora por Categoría</h2>
        <p className="categories-description">
          Cada categoría tiene su propia página dedicada donde puedes ver todos los repuestos disponibles, 
          filtrar por marca y modelo, y comparar hasta 3 productos simultáneamente para encontrar la mejor opción.
        </p>
        
        <div className="categories-grid-main">
          {categorias.map((categoria) => (
            <Link 
              key={categoria} 
              to={`/categoria/${encodeURIComponent(categoria)}`}
              className="category-card"
            >
              <div className="category-card-icon">
                {getCategoryIcon(categoria)}
              </div>
              <div className="category-card-content">
                <h3>{categoria}</h3>
                <p>{getCategoryDescription(categoria)}</p>
                <div className="category-card-arrow">
                  <FaArrowRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tipos más buscados */}
      <QuickFilters />

      {/* Estadísticas por categoría */}
      <CategoryStats />

      {/* Repuestos recientes */}
      {estadisticas.repuestosRecientes.length > 0 && (
        <div className="recent-products-section">
          <h2>Productos Recientes</h2>
          <p>Los últimos repuestos agregados a nuestro catálogo</p>
          
          <div className="recent-products-grid">
            {estadisticas.repuestosRecientes.map((repuesto) => (
              <div key={repuesto.id} className="recent-product-card">
                <img
                  src={repuesto.imagen_url || imagenDefecto}
                  alt={repuesto.nombre}
                  className="recent-product-image"
                />
                <div className="recent-product-info">
                  <h4>{repuesto.nombre}</h4>
                  <p className="recent-product-category">{repuesto.categoria}</p>
                  <div className="recent-product-details">
                    <span className="recent-product-brand">{repuesto.marca}</span>
                    <span className="recent-product-price">
                      {repuesto.precio.toLocaleString('es-CL')} CLP
                    </span>
                  </div>
                  <Link 
                    to={`/categoria/${encodeURIComponent(repuesto.categoria)}`}
                    className="recent-product-link"
                  >
                    Ver en {repuesto.categoria} <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de información */}
      <div className="info-section">
        <div className="info-cards">
          <div className="info-card">
            <FaStore className="info-icon" />
            <h3>Múltiples Tiendas</h3>
            <p>Comparamos precios de diferentes tiendas para encontrar las mejores ofertas</p>
          </div>
          <div className="info-card">
            <FaTags className="info-icon" />
            <h3>Comparación Fácil</h3>
            <p>Compara hasta 3 repuestos simultáneamente para tomar la mejor decisión</p>
          </div>
          <div className="info-card">
            <FaBoxes className="info-icon" />
            <h3>Amplio Catálogo</h3>
            <p>Miles de repuestos organizados por categorías para facilitar tu búsqueda</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;