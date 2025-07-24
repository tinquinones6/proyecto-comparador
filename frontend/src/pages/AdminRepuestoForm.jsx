import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';
import { toast } from 'react-toastify';
import { FaPlus, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import '../styles/admin-new.css';

function AdminRepuestoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [tiposDisponibles, setTiposDisponibles] = useState([]);
  const [fromComments, setFromComments] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    modelo: '',
    precio: '',
    tienda: '',
    url: '',
    categoria: '',
    tipo: ''
  });

  useEffect(() => {
    cargarDatosIniciales();
    
    // Verificar si venimos desde la gestión de comentarios
    const urlParams = new URLSearchParams(window.location.search);
    const fromCommentsParam = urlParams.get('from') === 'comments';
    setFromComments(fromCommentsParam);
    
    if (fromCommentsParam && id) {
      toast.info('🔧 Modo corrección: Edita este repuesto para resolver el problema reportado', {
        duration: 5000
      });
    }
  }, [id]);

  // Cargar tipos cuando cambie la categoría
  useEffect(() => {
    if (formData.categoria) {
      cargarTiposPorCategoria(formData.categoria);
    }
  }, [formData.categoria]);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      // Cargar categorías disponibles
      await cargarCategorias();
      // Cargar tiendas disponibles
      await cargarTiendas();
      
      // Si es edición, cargar el repuesto
      if (id) {
        await cargarRepuesto();
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      toast.error('Error al cargar los datos del formulario');
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await api.get('/repuestos/categorias');
      setCategorias(response.data.sort());
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      // Fallback con categorías predefinidas
      setCategorias([
        'Motor',
        'Frenos', 
        'Carrocería',
        'Sistema eléctrico',
        'Suspensión y dirección',
        'Transmisión',
        'Enfriamiento',
        'Filtros',
        'Sistema de escape',
        'Accesorios'
      ]);
    }
  };

  const cargarTiposPorCategoria = async (categoria) => {
    if (!categoria) {
      setTiposDisponibles([]);
      return;
    }
    
    try {
      const response = await api.get(`/repuestos/tipos/${categoria}`);
      setTiposDisponibles(response.data);
    } catch (error) {
      console.error('Error al cargar tipos:', error);
      setTiposDisponibles([]);
    }
  };

  // Tipos específicos por categoría
  const getTiposPorCategoria = (categoria) => {
    const tiposPorCategoria = {
      'Motor': [
        'Aceite de motor', 'Filtro de aceite', 'Bujías', 'Cables de bujía', 'Bobinas de encendido',
        'Correa de distribución', 'Cadena de distribución', 'Tensor de correa', 'Polea de cigüeñal',
        'Junta de culata', 'Empacaduras', 'Pistones', 'Anillos de pistón', 'Válvulas'
      ],
      'Frenos': [
        'Pastillas de freno delanteras', 'Pastillas de freno traseras', 'Discos de freno delanteros',
        'Discos de freno traseros', 'Líquido de frenos', 'Mangueras de freno', 'Cilindro maestro',
        'Bomba de freno', 'Servo freno', 'Freno de mano', 'Zapatas de freno'
      ],
      'Carrocería': [
        'Parachoques delantero', 'Parachoques trasero', 'Faro delantero', 'Faro trasero',
        'Espejo retrovisor', 'Puerta', 'Capó', 'Maletero', 'Ventanilla', 'Moldura',
        'Emblema', 'Antena', 'Limpiaparabrisas', 'Escobillas'
      ],
      'Sistema eléctrico': [
        'Batería', 'Alternador', 'Motor de arranque', 'Relé', 'Fusible', 'Cableado',
        'Sensor de velocidad', 'Sensor de temperatura', 'Sensor de oxígeno', 'ECU',
        'Modulo de control', 'Arnés eléctrico'
      ],
      'Suspensión y dirección': [
        'Amortiguadores delanteros', 'Amortiguadores traseros', 'Resortes', 'Muelles',
        'Rótulas', 'Brazos de suspensión', 'Cremallera de dirección', 'Bomba de dirección',
        'Líquido de dirección', 'Terminales de dirección', 'Bieletas', 'Bujes'
      ],
      'Transmisión': [
        'Aceite de transmisión', 'Filtro de transmisión', 'Embrague', 'Disco de embrague',
        'Placa de presión', 'Cojinete de embrague', 'Cilindro de embrague', 'Junta homocinética',
        'Semieje', 'Diferencial'
      ],
      'Enfriamiento': [
        'Radiador', 'Termostato', 'Bomba de agua', 'Mangueras de radiador', 'Líquido refrigerante',
        'Ventilador de radiador', 'Sensor de temperatura', 'Tapa de radiador', 'Depósito de expansión'
      ],
      'Filtros': [
        'Filtro de aire', 'Filtro de combustible', 'Filtro de aceite', 'Filtro de cabina',
        'Filtro de aire acondicionado', 'Filtro de transmisión'
      ],
      'Sistema de escape': [
        'Silenciador', 'Catalizador', 'Tubo de escape', 'Colector de escape', 'Sonda lambda',
        'Junta de escape', 'Abrazadera de escape'
      ],
      'Accesorios': [
        'Alfombrillas', 'Fundas de asiento', 'Protector de maletero', 'Parasol',
        'Cargador de celular', 'Soporte de celular', 'Ambientador', 'Kit de herramientas'
      ]
    };
    
    return tiposPorCategoria[categoria] || [];
  };

  const cargarTiendas = async () => {
    try {
      // Obtener tiendas únicas de los repuestos existentes
      const response = await api.get('/repuestos?limit=1000');
      const tiendasUnicas = [...new Set(response.data.map(r => r.tienda))].filter(Boolean).sort();
      setTiendas(tiendasUnicas);
    } catch (error) {
      console.error('Error al cargar tiendas:', error);
      setTiendas([]);
    }
  };

  const cargarRepuesto = async () => {
    try {
      const response = await api.get(`/repuestos/${id}`);
      if (response.data) {
        // Primero cargar tipos para la categoría
        if (response.data.categoria) {
          await cargarTiposPorCategoria(response.data.categoria);
        }
        // Luego establecer los datos del formulario
        setFormData(response.data);
        toast.success('Repuesto cargado correctamente');
      } else {
        toast.error('No se encontró el repuesto');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error al cargar el repuesto:', error);
      toast.error('Error al cargar el repuesto. Verifica que exista.');
      navigate('/admin');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        precio: parseFloat(formData.precio)
      };

      if (id) {
        await api.put(`/repuestos/${id}`, dataToSend);
        toast.success('Repuesto actualizado correctamente');
      } else {
        await api.post('/repuestos', dataToSend);
        toast.success('Repuesto agregado correctamente');
      }
      
      // Redirigir según el origen
      if (fromComments) {
        navigate('/admin/comments');
        toast.info('¡Problema corregido! Puedes marcar el comentario como resuelto.');
      } else {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el repuesto. Por favor, verifica los datos.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Si cambió la categoría, limpiar el tipo para que el usuario seleccione uno nuevo
      if (name === 'categoria' && value !== prev.categoria) {
        newData.tipo = '';
      }
      
      return newData;
    });
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-section">
          <div className="admin-header" style={{ marginBottom: '2rem' }}>
            <h1 className="admin-title">
              {id ? 'Editar Repuesto' : 'Agregar Nuevo Repuesto'}
              {fromComments && <span style={{ color: 'var(--warning-color)', fontSize: '0.8em', marginLeft: '1rem' }}>🔧 Modo Corrección</span>}
            </h1>
            <div className="admin-actions">
              {fromComments ? (
                <button
                  onClick={() => navigate('/admin/comments')}
                  className="admin-btn admin-btn-secondary"
                >
                  <FaArrowLeft />
                  Volver a Comentarios
                </button>
              ) : (
                <button
                  onClick={() => navigate('/admin')}
                  className="admin-btn admin-btn-outline"
                >
                  <FaArrowLeft />
                  Volver al Panel
                </button>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="admin-input"
                required
                placeholder="Nombre del repuesto"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Marca</label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                className="admin-input"
                required
                placeholder="Marca del vehículo"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Modelo</label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleInputChange}
                className="admin-input"
                required
                placeholder="Modelo del vehículo"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                className="admin-input"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Tienda</label>
              <div className="form-input-group">
                <select
                  name="tienda"
                  value={formData.tienda}
                  onChange={handleInputChange}
                  className="admin-input"
                  required
                >
                  <option value="">Selecciona una tienda</option>
                  {tiendas.map(tienda => (
                    <option key={tienda} value={tienda}>{tienda}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="tienda_nueva"
                  placeholder="O escribe una nueva tienda"
                  className="admin-input"
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData(prev => ({ ...prev, tienda: e.target.value }));
                    }
                  }}
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="admin-input"
                required
                placeholder="https://ejemplo.com/producto"
              />
            </div>
            
            <div className="form-group form-group-full">
              <label className="form-label">Categoría</label>
              <div className="form-input-group">
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="admin-input"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="categoria_nueva"
                  placeholder="O escribe una nueva categoría"
                  className="admin-input"
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData(prev => ({ ...prev, categoria: e.target.value }));
                    }
                  }}
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            </div>
            
            <div className="form-group form-group-full">
              <label className="form-label">Tipo de Repuesto</label>
              <div className="form-input-group">
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="admin-input"
                  disabled={!formData.categoria}
                >
                  <option value="">
                    {formData.categoria ? 'Selecciona un tipo' : 'Primero selecciona una categoría'}
                  </option>
                  {/* Tipos desde la base de datos */}
                  {tiposDisponibles.map(tipoObj => (
                    <option key={tipoObj.id_tipo} value={tipoObj.nombre}>{tipoObj.nombre}</option>
                  ))}
                  {/* Tipos predefinidos si no hay tipos en BD para esta categoría */}
                  {tiposDisponibles.length === 0 && formData.categoria && getTiposPorCategoria(formData.categoria).map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="tipo_nuevo"
                  placeholder="O escribe un tipo personalizado"
                  className="admin-input"
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData(prev => ({ ...prev, tipo: e.target.value }));
                    }
                  }}
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
              >
                {id ? <FaSave /> : <FaPlus />}
                {id ? 'Actualizar Repuesto' : 'Agregar Repuesto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminRepuestoForm; 