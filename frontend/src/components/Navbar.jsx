import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt, FaTools, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../styles/navbar.css';

function Navbar() {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/logo.png" alt="TuRepuesto.cl" className="navbar-logo" />
        <h2>TuRepuesto.cl</h2>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          <FaHome /> <span>Inicio</span>
        </Link>

        {token ? (
          // Usuario autenticado
          <>
            {rol === 'admin' && (
              <Link to="/admin" className="nav-link">
                <FaTools /> <span>Panel Admin</span>
              </Link>
            )}

            <Link to="/perfil" className="nav-link">
              <FaUser /> <span>Perfil</span>
            </Link>

            <button onClick={handleLogout} className="nav-link logout-button">
              <FaSignOutAlt /> <span>Cerrar sesión</span>
            </button>
          </>
        ) : (
          // Usuario no autenticado
          <>
            <Link to="/perfil" className="nav-link">
              <FaUser /> <span>Mi Cuenta</span>
            </Link>

            <Link to="/login" className="nav-link">
              <FaSignInAlt /> <span>Iniciar Sesión</span>
            </Link>

            <Link to="/register" className="nav-link register-button">
              <FaUserPlus /> <span>Registrarse</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 