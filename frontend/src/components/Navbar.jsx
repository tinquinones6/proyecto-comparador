import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt, FaTools } from 'react-icons/fa';
import '../styles/navbar.css';

function Navbar() {
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
        <h2>Comparador de Repuestos</h2>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          <FaHome /> <span>Inicio</span>
        </Link>

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
      </div>
    </nav>
  );
}

export default Navbar; 