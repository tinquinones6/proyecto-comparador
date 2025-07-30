import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import { FaUser, FaLock } from 'react-icons/fa';
import '../styles/login.css';

function Login() {
  const [credentials, setCredentials] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('rol', response.data.rol);
      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>TuRepuesto.cl</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="input-icon">
              <FaUser />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={credentials.correo}
                onChange={(e) => setCredentials({ ...credentials, correo: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-icon">
              <FaLock />
              <input
                type="password"
                placeholder="Contraseña"
                value={credentials.contrasena}
                onChange={(e) => setCredentials({ ...credentials, contrasena: e.target.value })}
                required
              />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            ¿No tienes una cuenta?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: 'var(--primary-color)', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;