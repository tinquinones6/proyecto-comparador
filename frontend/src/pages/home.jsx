import { useEffect, useState } from 'react';
import api from '../config/api';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import CommentForm from '../components/CommentForm';

function Home() {
  const [repuestos, setRepuestos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [filtro, setFiltro] = useState({ nombre: '', marca: '', modelo: '' });
  const [comparar, setComparar] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchRepuestos();
  }, [categoriaSeleccionada]);

  useEffect(() => {
    if (repuestos.length > 0) {
      const uniqueMarcas = [...new Set(repuestos.map(r => r.marca))];
      const uniqueModelos = [...new Set(repuestos.map(r => r.modelo))];
      setMarcas(uniqueMarcas);
      setModelos(uniqueModelos);
    }
  }, [repuestos]);

  const fetchCategorias = async () => {
    try {
      const res = await api.get('/repuestos/categorias');
      setCategorias(res.data);
    } catch (err) {
      console.error('Error al obtener categorías', err);
    }
  };

  const fetchRepuestos = async () => {
    try {
      const res = await api.get('/repuestos', {
        params: categoriaSeleccionada ? { categoria: categoriaSeleccionada } : {}
      });
      setRepuestos(res.data);
    } catch (err) {
      console.error('Error al obtener repuestos', err);
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

  const limpiarFiltros = () => {
    setFiltro({ nombre: '', marca: '', modelo: '' });
    setCategoriaSeleccionada('');
  };

  const filtrarRepuestos = repuestos.filter((r) =>
    r.nombre.toLowerCase().includes(filtro.nombre.toLowerCase()) &&
    (filtro.marca ? r.marca === filtro.marca : true) &&
    (filtro.modelo ? r.modelo === filtro.modelo : true)
  );

  const imagenDefecto = 'https://via.placeholder.com/300x160.png?text=Sin+imagen';

  return (
    <div className="home-content">
      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stats-card">
          <h3>Total Productos</h3>
          <div className="number">{repuestos.length}</div>
          <div className="label">En inventario</div>
        </div>
        <div className="stats-card">
          <h3>En Comparación</h3>
          <div className="number">{comparar.length}/3</div>
          <div className="label">Productos seleccionados</div>
        </div>
        <div className="stats-card">
          <h3>Categorías</h3>
          <div className="number">{categorias.length}</div>
          <div className="label">Disponibles</div>
        </div>
      </div>

      {/* Selector de categorías */}
      <div className="categories-section">
        <h2>Categorías de Repuestos</h2>
        <div className="categories-grid">
          <button
            className={`category-button ${!categoriaSeleccionada ? 'active' : ''}`}
            onClick={() => setCategoriaSeleccionada('')}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              className={`category-button ${categoriaSeleccionada === cat ? 'active' : ''}`}
              onClick={() => setCategoriaSeleccionada(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="search-container">
        <div className={`search-wrapper ${searchExpanded ? 'expanded' : ''}`}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar repuestos..."
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
              <label>Marca:</label>
              <select
                value={filtro.marca}
                onChange={(e) => setFiltro({ ...filtro, marca: e.target.value })}
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
              >
                <option value="">Todos los modelos</option>
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

      {/* Tabla de comparación */}
      {comparar.length > 0 && (
        <div className="comparison-section">
          <h2>Comparación de Repuestos</h2>
          <div className="comparison-grid">
            {comparar.map((r) => (
              <div key={r.id} className="product-card" style={{background: 'var(--comparison-background)'}}>
                <img
                  src={r.imagen_url || imagenDefecto}
                  alt={r.nombre}
                  className="product-image"
                />
                <div className="product-info">
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
            ))}
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
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Precio</th>
              <th>Tienda</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarRepuestos.map((r) => (
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
                <td>{r.marca}</td>
                <td>{r.modelo}</td>
                <td className="price">{r.precio} CLP</td>
                <td>{r.tienda}</td>
                <td>
                  <button
                    className="button-primary"
                    onClick={() => agregarAComparacion(r)}
                    disabled={comparar.find((c) => c.id === r.id) || comparar.length >= 3}
                  >
                    Comparar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;