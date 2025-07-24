import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../config/api';
import { FaSearch, FaFilter, FaTimes, FaArrowLeft } from 'react-icons/fa';
import CommentForm from '../components/CommentForm';
import FavoritoButton from '../components/FavoritoButton';
import '../styles/home.css';
import '../styles/category.css';

function CategoryPage() {
  const { categoria } = useParams();
  const [repuestos, setRepuestos] = useState([]);
  const [tiposDisponibles, setTiposDisponibles] = useState([]);
  const [filtro, setFiltro] = useState({ nombre: '', marca: '', modelo: '', tipo: '' });
  const [comparar, setComparar] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detectar si hay un filtro de tipo en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const tipoFromUrl = urlParams.get('tipo');
    
    if (tipoFromUrl) {
      setFiltro(prev => ({ ...prev, tipo: tipoFromUrl }));
    }
    
    fetchRepuestosByCategoria();
    fetchTiposPorCategoria();
  }, [categoria]);

  useEffect(() => {
    fetchRepuestosByCategoria();
  }, [filtro.tipo]);

  useEffect(() => {
    if (repuestos.length > 0) {
      const uniqueMarcas = [...new Set(repuestos.map(r => r.marca))];
      setMarcas(uniqueMarcas);
      
      // Filtrar modelos según la marca seleccionada
      if (filtro.marca) {
        const modelosPorMarca = [...new Set(
          repuestos
            .filter(r => r.marca === filtro.marca)
            .map(r => r.modelo)
        )];
        setModelos(modelosPorMarca);
      } else {
        const uniqueModelos = [...new Set(repuestos.map(r => r.modelo))];
        setModelos(uniqueModelos);
      }
    }
  }, [repuestos, filtro.marca]);

  const fetchTiposPorCategoria = async () => {
    try {
      const res = await api.get(`/repuestos/tipos/${categoria}`);
      setTiposDisponibles(res.data);
    } catch (err) {
      console.error('Error al obtener tipos de la categoría', err);
    }
  };

  const fetchRepuestosByCategoria = async () => {
    try {
      setLoading(true);
      const params = { categoria: categoria };
      if (filtro.tipo) {
        params.tipo = filtro.tipo;
      }
      const res = await api.get('/repuestos', { params });
      setRepuestos(res.data);
    } catch (err) {
      console.error('Error al obtener repuestos de la categoría', err);
    } finally {
      setLoading(false);
    }
  };

  const agregarAComparacion = (repuesto) => {
    if (comparar.length >= 3) return;
    if (comparar.find(r => r.id === repuesto.id)) return;
    setComparar([...comparar, repuesto]);
  };

  const quitarDeComparacion = (id) => {
    setComparar(comparar.filter(r => r.id !== id));
  };

  const limpiarComparacion = () => setComparar([]);

  // Función para encontrar el producto más barato
  const getProductoMasBarato = () => {
    if (comparar.length === 0) return null;
    return comparar.reduce((min, current) => {
      return current.precio < min.precio ? current : min;
    });
  };

  const limpiarFiltros = () => {
    setFiltro({ nombre: '', marca: '', modelo: '', tipo: '' });
  };

  // Función para obtener iconos específicos por tipo de repuesto
  const getIconoTipo = (nombreTipo) => {
    const iconos = {
      // Motor
      'Aceite de motor': '🛢️',
      'Filtro de aceite': '🔵',
      'Bujias': '⚡',
      'Bujía': '⚡',
      'Bobina': '🔌',
      'Bobinas de encendido': '🔌',
      'Correa': '🔗',
      'Distribucion': '⚙️',
      'Cadena de distribución': '🔗',
      'Termostato': '🌡️',
      'Motor': '🔧',
      'Pistones': '🔧',
      'Válvulas': '🔧',
      'Turbo': '💨',
      'Compresor': '💨',
      'Inyector': '💉',
      'Empaquetadura': '🔲',
      'Reten': '🔲',
      'Anillo': '⭕',
      'Balancin': '⚖️',
      'Valvula': '🔧',

      // Frenos
      'Pastillas de freno': '🛑',
      'Discos de freno': '🔴',
      'Líquido de frenos': '🟦',
      'Freno': '🛑',
      'Balata': '🛑',

      // Carrocería
      'Parachoques': '🚗',
      'Faro': '💡',
      'Espejo': '🪞',
      'Puerta': '🚪',
      'Ventanilla': '🪟',
      'Capó': '🚗',
      'Guardafango': '🚗',
      'Parrilla': '🚗',
      'Moldura': '📏',

      // Sistema eléctrico
      'Batería': '🔋',
      'Alternador': '⚡',
      'Sensor': '📡',
      'Fusible': '🔌',
      'Relé': '🔌',
      'Cableado': '🔌',
      'Bombillo': '💡',
      'Led': '💡',

      // Suspensión
      'Amortiguador': '🎯',
      'Resorte': '🌀',
      'Rótula': '⚪',
      'Brazo': '🦾',
      'Terminal': '🔗',
      'Bieleta': '🔗',
      'Buje': '⚪',

      // Transmisión
      'Embrague': '⚙️',
      'Disco de embrague': '⚙️',
      'Junta': '🔗',
      'Semieje': '🔗',
      'Diferencial': '⚙️',

      // Filtros
      'Filtro': '🔄',
      'Filtro de aire': '💨',
      'Filtro de combustible': '⛽',
      'Filtro de cabina': '💨',

      // Enfriamiento
      'Radiador': '🔥',
      'Bomba de agua': '💧',
      'Manguera': '🔗',
      'Ventilador': '💨',

      // Escape
      'Silenciador': '🔇',
      'Catalizador': '🔬',
      'Tubo de escape': '💨',
      'Colector': '📯',

      // Aceites y fluidos
      'Aceite': '🛢️',
      'Líquido': '💧',
      'Refrigerante': '❄️',

      // Herramientas y accesorios
      'Llave': '🔧',
      'Destornillador': '🪛',
      'Kit': '🧰',
      'Herramienta': '🔧',
      'Accesorio': '🎯'
    };

    // Buscar por coincidencia exacta primero
    if (iconos[nombreTipo]) {
      return iconos[nombreTipo];
    }

    // Buscar por coincidencia parcial
    for (const [clave, icono] of Object.entries(iconos)) {
      if (nombreTipo.toLowerCase().includes(clave.toLowerCase()) || 
          clave.toLowerCase().includes(nombreTipo.toLowerCase())) {
        return icono;
      }
    }

    // Icono por defecto
    return '🔧';
  };

  const filtrarRepuestos = repuestos.filter((r) =>
    r.nombre.toLowerCase().includes(filtro.nombre.toLowerCase()) &&
    (filtro.marca ? r.marca === filtro.marca : true) &&
    (filtro.modelo ? r.modelo === filtro.modelo : true)
    // El filtro por tipo ya se aplica en el backend
  );

  const imagenDefecto = 'https://via.placeholder.com/300x160.png?text=Sin+imagen';

  if (loading) {
    return (
      <div className="home-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando repuestos de {categoria}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-content">
      {/* Header de la categoría */}
      <div className="category-header">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Volver al inicio
        </Link>
        <h1 className="category-title">Repuestos de {categoria}</h1>
        <p className="category-subtitle">
          {repuestos.length} productos disponibles • Compara hasta 3 productos para tomar la mejor decisión
        </p>
      </div>

      {/* Subcategorías (Tipos de repuesto) */}
      {tiposDisponibles.length > 0 && (
        <div className="subcategories-section">
          <h3 className="subcategories-title">Tipos de repuestos de {categoria}</h3>
          <p className="subcategories-description">
            Filtra por tipo específico para encontrar exactamente lo que necesitas
          </p>
          <div className="subcategories-grid">
            <button
              className={`subcategory-card ${!filtro.tipo ? 'active' : ''}`}
              onClick={() => setFiltro(prev => ({ ...prev, tipo: '' }))}
            >
              <div className="subcategory-header">
                <div className="subcategory-icon">🔍</div>
                <div className="subcategory-name">Todos</div>
              </div>
              <div className="subcategory-stats">
                <div className="subcategory-count">
                  {tiposDisponibles.reduce((total, tipo) => total + parseInt(tipo.cantidad), 0)} productos
                </div>
                <div className="subcategory-range">
                  Todas las opciones
                </div>
              </div>
            </button>
            {tiposDisponibles.map((tipo) => (
              <button
                key={tipo.id_tipo}
                className={`subcategory-card ${filtro.tipo === tipo.nombre ? 'active' : ''}`}
                onClick={() => setFiltro(prev => ({ ...prev, tipo: tipo.nombre }))}
              >
                <div className="subcategory-header">
                  <div className="subcategory-icon">
                    {getIconoTipo(tipo.nombre)}
                  </div>
                  <div className="subcategory-name">{tipo.nombre}</div>
                </div>
                <div className="subcategory-stats">
                  <div className="subcategory-count">{tipo.cantidad} productos</div>
                  <div className="subcategory-range">
                    {tipo.precio_minimo && tipo.precio_maximo ? (
                      tipo.precio_minimo === tipo.precio_maximo ? 
                        `$${Number(tipo.precio_minimo).toLocaleString()}` :
                        `$${Number(tipo.precio_minimo).toLocaleString()} - $${Number(tipo.precio_maximo).toLocaleString()}`
                    ) : 'Precio variable'}
                  </div>
                  <div className="subcategory-details">
                    {tipo.marcas_disponibles && (
                      <span>{tipo.marcas_disponibles} marcas</span>
                    )}
                    {tipo.tiendas_disponibles && (
                      <span> • {tipo.tiendas_disponibles} tiendas</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas de la categoría */}
      <div className="stats-grid">
        <div className="stats-card">
          <h3>Productos {filtro.tipo ? `en ${filtro.tipo}` : `en ${categoria}`}</h3>
          <div className="number">{filtrarRepuestos.length}</div>
          <div className="label">{filtro.tipo ? 'Del tipo seleccionado' : 'Disponibles'}</div>
        </div>
        <div className="stats-card">
          <h3>En Comparación</h3>
          <div className="number">{comparar.length}/3</div>
          <div className="label">Productos seleccionados</div>
        </div>
        <div className="stats-card">
          <h3>Marcas</h3>
          <div className="number">{marcas.filter(marca => 
            filtrarRepuestos.some(r => r.marca === marca)
          ).length}</div>
          <div className="label">{filtro.tipo ? 'En tipo seleccionado' : 'Diferentes marcas'}</div>
        </div>
        {filtro.tipo && (
          <div className="stats-card active-filter-card">
            <h3>Filtro Activo</h3>
            <div className="number">📍</div>
            <div className="label">{filtro.tipo}</div>
            <button 
              className="clear-filter-btn"
              onClick={() => setFiltro(prev => ({ ...prev, tipo: '' }))}
              title="Quitar filtro"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="search-container">
        <div className={`search-wrapper ${searchExpanded ? 'expanded' : ''}`}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-bar"
            placeholder={`Buscar en ${categoria}...`}
            value={filtro.nombre}
            onChange={(e) => setFiltro({ ...filtro, nombre: e.target.value })}
            onFocus={() => setSearchExpanded(true)}
            onBlur={() => setSearchExpanded(false)}
          />
          {filtro.nombre && (
            <button 
              className="clear-search" 
              onClick={() => setFiltro({ ...filtro, nombre: '' })}
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button 
          className={`filter-button ${mostrarFiltros ? 'active' : ''}`}
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          <FaFilter />
          <span>Filtros</span>
        </button>
      </div>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <div className="filters-panel">
          <div className="filters-content">
            <div className="filter-group">
              <label>Tipo:</label>
              <select
                value={filtro.tipo}
                onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
              >
                <option value="">Todos los tipos</option>
                {tiposDisponibles.map((tipo) => (
                  <option key={tipo.id_tipo} value={tipo.nombre}>{tipo.nombre}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Marca:</label>
              <select
                value={filtro.marca}
                onChange={(e) => setFiltro({ ...filtro, marca: e.target.value, modelo: '' })}
              >
                <option value="">Todas las marcas</option>
                {marcas.map((marca) => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Modelo:</label>
              <select
                value={filtro.modelo}
                onChange={(e) => setFiltro({ ...filtro, modelo: e.target.value })}
                disabled={!filtro.marca}
              >
                <option value="">
                  {filtro.marca ? 'Todos los modelos' : 'Primero selecciona una marca'}
                </option>
                {modelos.map((modelo) => (
                  <option key={modelo} value={modelo}>{modelo}</option>
                ))}
              </select>
            </div>
            <button className="button-secondary" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Sección de comparación */}
      {comparar.length > 0 && (
        <div className="comparison-section">
          <h2>Comparación de repuestos de {categoria}</h2>
          <div className="comparison-grid">
            {comparar.map((r) => {
              const productoMasBarato = getProductoMasBarato();
              const esMasBarato = productoMasBarato && r.id === productoMasBarato.id && comparar.length > 1;
              
              return (
                <div 
                  key={r.id} 
                  className={`product-card ${esMasBarato ? 'producto-mas-barato' : ''}`}
                  style={{background: 'var(--comparison-background)'}}
                >
                <img
                  src={r.imagen_url || imagenDefecto}
                  alt={r.nombre}
                  className="product-image"
                />
                <div className="product-info">
                  {esMasBarato && (
                    <div className="precio-mejor-oferta">
                      🏆 ¡Mejor Precio!
                    </div>
                  )}
                  <h3>{r.nombre}</h3>
                  <p className="price">{r.precio.toLocaleString('es-CL')} CLP</p>
                  <p><strong>Marca:</strong> {r.marca}</p>
                  <p><strong>Modelo:</strong> {r.modelo}</p>
                  <p><strong>Tienda:</strong> {r.tienda}</p>
                  <div className="product-actions">
                    <button
                      className="button-danger"
                      onClick={() => quitarDeComparacion(r.id)}
                    >
                      Quitar
                    </button>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-primary"
                    >
                      Comprar
                    </a>
                  </div>
                  <CommentForm sparepartId={r.id} />
                </div>
              </div>
              );
            })}
          </div>
          <button 
            className="button-secondary" 
            onClick={limpiarComparacion}
            style={{display: 'block', margin: '2rem auto 0'}}
          >
            Limpiar comparación
          </button>
        </div>
      )}

      {/* Lista de repuestos */}
      <div className="inventory-table-container">
        {comparar.length === 0 && (
          <div style={{
            padding: '1rem',
            margin: '1rem 0',
            backgroundColor: 'var(--background-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              💡 Haz clic en "Comparar" en cualquier producto para comenzar a comparar precios y características
            </p>
          </div>
        )}
        
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Precio</th>
              <th>Tienda</th>
              <th>Favorito</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarRepuestos.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8">
                  <p>No se encontraron repuestos en la categoría {categoria}</p>
                </td>
              </tr>
            ) : (
              filtrarRepuestos.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="product-cell">
                      <img
                        src={r.imagen_url || imagenDefecto}
                        alt={r.nombre}
                        className="product-thumbnail"
                      />
                      <span>{r.nombre}</span>
                    </div>
                  </td>
                  <td>
                    <span className="tipo-badge">{r.tipo || 'General'}</span>
                  </td>
                  <td>{r.marca}</td>
                  <td>{r.modelo}</td>
                  <td className="price">{r.precio.toLocaleString('es-CL')} CLP</td>
                  <td>{r.tienda}</td>
                  <td>
                    <div className="favorito-cell">
                      <FavoritoButton 
                        repuesto={r} 
                        size="small"
                        showText={false}
                      />
                    </div>
                  </td>
                  <td>
                    {comparar.find((c) => c.id === r.id) ? (
                      <button className="button-secondary" disabled>
                        Ya en comparación
                      </button>
                    ) : comparar.length >= 3 ? (
                      <button className="button-secondary" disabled>
                        Máximo 3 productos
                      </button>
                    ) : (
                      <button
                        className="button-primary"
                        onClick={() => agregarAComparacion(r)}
                      >
                        Comparar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryPage;
