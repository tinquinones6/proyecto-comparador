import { useState, useEffect } from 'react';
import { FaCar, FaPlus, FaEdit, FaTrash, FaStar, FaSave, FaTimes } from 'react-icons/fa';
import api from '../config/api';
import { toast } from 'react-toastify';

const VehiculosManager = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [agregando, setAgregando] = useState(false);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: ''
  });

  useEffect(() => {
    cargarVehiculos();
    cargarMarcas();
  }, []);

  const cargarVehiculos = async () => {
    try {
      const response = await api.get('/auth/vehiculos');
      console.log('Datos de vehículos recibidos:', response.data);
      // El backend devuelve { vehiculos: [...] }
      const vehiculosData = response.data.vehiculos || response.data;
      setVehiculos(Array.isArray(vehiculosData) ? vehiculosData : []);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      toast.error('Error al cargar vehículos');
      setVehiculos([]); // Asegurar que sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const cargarMarcas = async () => {
    try {
      const response = await api.get('/auth/marcas');
      console.log('Datos de marcas recibidos:', response.data);
      // El backend devuelve { marcas: [...] }
      const marcasData = response.data.marcas || response.data;
      setMarcas(Array.isArray(marcasData) ? marcasData : []);
    } catch (error) {
      console.error('Error al cargar marcas:', error);
      setMarcas([]); // Asegurar que sea un array vacío en caso de error
    }
  };

  const cargarModelos = async (marca) => {
    try {
      const response = await api.get(`/auth/marcas/${encodeURIComponent(marca)}/modelos`);
      console.log('Datos de modelos recibidos:', response.data);
      // El backend devuelve { modelos: [...] }
      const modelosData = response.data.modelos || response.data;
      setModelos(Array.isArray(modelosData) ? modelosData : []);
    } catch (error) {
      console.error('Error al cargar modelos:', error);
      setModelos([]); // Asegurar que sea un array vacío en caso de error
    }
  };

  const handleMarcaChange = (marca) => {
    setFormData({ marca, modelo: '' });
    if (marca) {
      cargarModelos(marca);
    } else {
      setModelos([]);
    }
  };

  const handleAgregar = () => {
    setAgregando(true);
    setFormData({ marca: '', modelo: '' });
    setModelos([]);
  };

  const handleCancelar = () => {
    setAgregando(false);
    setEditandoId(null);
    setFormData({ marca: '', modelo: '' });
    setModelos([]);
  };

  const handleGuardar = async () => {
    if (!formData.marca || !formData.modelo) {
      toast.error('Marca y modelo son obligatorios');
      return;
    }

    try {
      if (editandoId) {
        await api.put(`/auth/vehiculos/${editandoId}`, formData);
        toast.success('Vehículo actualizado correctamente');
      } else {
        await api.post('/auth/vehiculos', formData);
        toast.success('Vehículo agregado correctamente');
      }
      
      await cargarVehiculos();
      handleCancelar();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
      toast.error('Error al guardar vehículo');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return;

    try {
      await api.delete(`/auth/vehiculos/${id}`);
      toast.success('Vehículo eliminado correctamente');
      cargarVehiculos();
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      toast.error('Error al eliminar vehículo');
    }
  };

  const handleMarcarPrincipal = async (id) => {
    try {
      await api.patch(`/auth/vehiculos/${id}/principal`);
      toast.success('Vehículo marcado como principal');
      cargarVehiculos();
    } catch (error) {
      console.error('Error al marcar como principal:', error);
      toast.error('Error al actualizar vehículo principal');
    }
  };

  const handleEditar = (vehiculo) => {
    setEditandoId(vehiculo.id);
    setFormData({ marca: vehiculo.marca, modelo: vehiculo.modelo });
    cargarModelos(vehiculo.marca);
  };

  if (loading) {
    return (
      <div className="perfil-card">
        <div className="perfil-section-header">
          <h2><FaCar /> Mis Vehículos</h2>
          <p className="perfil-section-subtitle">Gestiona los vehículos asociados a tu cuenta</p>
        </div>
        <div className="perfil-info">
          <div className="loading-state">Cargando vehículos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-card">
      <div className="perfil-section-header">
        <h2><FaCar /> Mis Vehículos</h2>
        <p className="perfil-section-subtitle">Gestiona los vehículos asociados a tu cuenta</p>
        {!agregando && !editandoId && (
          <button onClick={handleAgregar} className="btn btn-primary">
            <FaPlus /> Agregar Vehículo
          </button>
        )}
      </div>

      {/* Formulario para agregar/editar */}
      {(agregando || editandoId) && (
        <div className="perfil-info">
          <div className="form-section">
            <h3 className="section-title">
              {editandoId ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            </h3>
            <div className="form-group">
              <label className="perfil-label">Marca del Vehículo</label>
              <select
                value={formData.marca}
                onChange={(e) => handleMarcaChange(e.target.value)}
                className="perfil-input"
              >
                <option value="">Selecciona una marca</option>
                {Array.isArray(marcas) && marcas.map((marca) => (
                  <option key={marca.id || marca.nombre || marca} value={marca.nombre || marca}>
                    {marca.nombre || marca}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="perfil-label">Modelo del Vehículo</label>
              <select
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                className="perfil-input"
                disabled={!formData.marca}
              >
                <option value="">
                  {formData.marca ? 'Selecciona un modelo' : 'Primero selecciona una marca'}
                </option>
                {Array.isArray(modelos) && modelos.map((modelo) => (
                  <option key={modelo.id || modelo.nombre || modelo} value={modelo.nombre || modelo}>
                    {modelo.nombre || modelo}
                  </option>
                ))}
              </select>
            </div>
            <div className="btn-group">
              <button onClick={handleGuardar} className="btn btn-success">
                <FaSave /> Guardar Vehículo
              </button>
              <button onClick={handleCancelar} className="btn btn-secondary">
                <FaTimes /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de vehículos */}
      <div className="perfil-info">
        {!Array.isArray(vehiculos) || vehiculos.length === 0 ? (
          <div className="empty-state">
            <FaCar size={48} color="var(--text-secondary)" />
            <p>No tienes vehículos registrados</p>
            <p className="empty-subtitle">Agrega tu primer vehículo para una experiencia personalizada</p>
          </div>
        ) : (
          <div className="vehiculos-grid">
            {vehiculos.map((vehiculo) => (
              <div key={vehiculo.id} className={`info-row vehiculo-item ${vehiculo.es_principal ? 'principal' : ''}`}>
                <div className="info-content">
                  <div className="info-header">
                    <div className="info-icon">
                      <FaCar />
                    </div>
                    <div className="info-details">
                      <div className="info-title">
                        {vehiculo.marca} {vehiculo.modelo}
                        {vehiculo.es_principal && (
                          <span className="principal-badge">
                            <FaStar /> Principal
                          </span>
                        )}
                      </div>
                      <div className="info-subtitle">
                        Agregado el {new Date(vehiculo.fecha_creacion).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="info-actions">
                  {!vehiculo.es_principal && (
                    <button
                      onClick={() => handleMarcarPrincipal(vehiculo.id)}
                      className="btn btn-star"
                      title="Marcar como principal"
                    >
                      <FaStar />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditar(vehiculo)}
                    className="btn btn-edit"
                    title="Editar vehículo"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleEliminar(vehiculo.id)}
                    className="btn btn-danger"
                    title="Eliminar vehículo"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiculosManager;
