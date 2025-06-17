import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { FaUser, FaLock } from 'react-icons/fa';
import '../styles/login.css';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
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
        <h2>Comparador de Repuestos</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="input-icon">
              <FaUser />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
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
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;