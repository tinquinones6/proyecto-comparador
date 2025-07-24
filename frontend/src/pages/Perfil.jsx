import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEdit, FaSave, FaTimes, FaCar, FaUserPlus, FaSignInAlt, FaHeart } from 'react-icons/fa';
import api from '../config/api';
import VehiculosManager from '../components/VehiculosManager';
import FavoritosManager from '../components/FavoritosManager';
import { toast } from 'react-toastify';
import '../styles/perfil.css';

function Perfil() {
  const [usuario, setUsuario] = useState({ nombre: '', email: '' });
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', confirmPassword: '' });
  const [activeTab, setActiveTab] = useState('perfil');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchPerfil();
    }
  }, [token]);

  const fetchPerfil = async () => {
    try {
      const res = await api.get('/auth/perfil');
      setUsuario(res.data);
      setFormData({ nombre: res.data.nombre, email: res.data.email, password: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error al obtener perfil:', err);
    }
  };

  const guardarCambios = async () => {
    try {
      // Validar contraseñas si se está intentando cambiar
      if (formData.password || formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Las contraseñas no coinciden');
          return;
        }
        if (formData.password.length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres');
          return;
        }
      }

      const dataToSend = {
        nombre: formData.nombre,
        email: formData.email
      };

      // Solo incluir la contraseña si se está cambiando
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      const res = await api.put('/auth/perfil', dataToSend);
      setUsuario(res.data);
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      setEditando(false);
      toast.success('Perfil actualizado correctamente');
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      toast.error('Error al actualizar el perfil');
    }
  };

  // Componente para usuarios no autenticados
  if (!token) {
    return (
      <div className="perfil-container">
        <div className="perfil-header">
          <FaUser size={48} color="var(--primary-color)" />
          <h1>Mi Cuenta</h1>
          <p className="perfil-subtitle">Accede a tu cuenta para gestionar tu información personal y vehículos</p>
        </div>

        <div className="perfil-card">
          <div className="login-prompt">
            <div className="login-prompt-content">
              <FaUser size={64} color="var(--text-secondary)" />
              <h2>¡Bienvenido a TuRepuesto.cl!</h2>
              <p>
                Para acceder a todas las funcionalidades de tu cuenta, incluyendo la gestión de vehículos 
                y favoritos, necesitas iniciar sesión o crear una cuenta.
              </p>
              
              <div className="login-prompt-actions">
                <Link to="/login" className="btn btn-primary">
                  <FaSignInAlt /> Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  <FaUserPlus /> Crear Cuenta
                </Link>
              </div>

              <div className="login-prompt-benefits">
                <h3>¿Por qué crear una cuenta?</h3>
                <ul>
                  <li>❤️ Guarda tus repuestos favoritos</li>
                  <li>🚗 Gestiona información de tus vehículos</li>
                  <li>📊 Compara precios de manera personalizada</li>
                  <li>🔔 Recibe notificaciones de nuevos productos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <FaUser size={48} color="var(--primary-color)" />
        <h1>Mi Perfil</h1>
        <p className="perfil-subtitle">Gestiona tu información personal y vehículos</p>
      </div>

      <div className="perfil-tabs">
        <button 
          className={`tab-button ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          <FaUser /> Información Personal
        </button>
        <button 
          className={`tab-button ${activeTab === 'vehiculos' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehiculos')}
        >
          <FaCar /> Mis Vehículos
        </button>
        <button 
          className={`tab-button ${activeTab === 'favoritos' ? 'active' : ''}`}
          onClick={() => setActiveTab('favoritos')}
        >
          <FaHeart /> Mis Favoritos
        </button>
      </div>

      {activeTab === 'perfil' && (
        <div className="perfil-card">
          <div className="perfil-card-header">
            <h2><FaUser /> Información Personal</h2>
            {!editando && (
              <button onClick={() => setEditando(true)} className="btn btn-edit">
                <FaEdit /> Editar
              </button>
            )}
          </div>
          
          {!editando ? (
            <div className="info-display">
              <div className="info-grid">
                <div className="info-field">
                  <div className="info-label">Nombre completo</div>
                  <div className="info-value">{usuario.nombre}</div>
                </div>
                <div className="info-field">
                  <div className="info-label">Correo electrónico</div>
                  <div className="info-value">{usuario.email}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="edit-form">
              <div className="form-section">
                <h3 className="form-section-title">Información Básica</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">Nombre completo</label>
                    <input 
                      type="text"
                      value={formData.nombre} 
                      onChange={e => setFormData({ ...formData, nombre: e.target.value })} 
                      className="form-input"
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Correo electrónico</label>
                    <input 
                      type="email"
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      className="form-input"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Cambiar Contraseña</h3>
                <p className="form-section-subtitle">Deja estos campos vacíos si no deseas cambiar tu contraseña</p>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">Nueva contraseña</label>
                    <input 
                      type="password"
                      value={formData.password} 
                      onChange={e => setFormData({ ...formData, password: e.target.value })} 
                      className="form-input"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Confirmar contraseña</label>
                    <input 
                      type="password"
                      value={formData.confirmPassword} 
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} 
                      className="form-input"
                      placeholder="Confirma tu nueva contraseña"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button onClick={guardarCambios} className="btn btn-primary">
                  <FaSave /> Guardar Cambios
                </button>
                <button onClick={() => setEditando(false)} className="btn btn-secondary">
                  <FaTimes /> Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'vehiculos' && (
        <div className="perfil-card">
          <VehiculosManager />
        </div>
      )}

      {activeTab === 'favoritos' && (
        <div className="perfil-card">
          <FavoritosManager />
        </div>
      )}
    </div>
  );
}

export default Perfil;