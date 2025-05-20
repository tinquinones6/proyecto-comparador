import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt, FaTools, FaBars } from 'react-icons/fa';
import '../styles/sidebar.css';
import { useSidebar } from '../context/SidebarContext';

function Sidebar() {
  const rol = localStorage.getItem('rol');
  const navigate = useNavigate();
  const { abierto, toggleSidebar } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    navigate('/login');
  };

  return (
    <>
      <div className="toggle-button" onClick={toggleSidebar}>
        <FaBars />
      </div>
      <div className={`sidebar ${abierto ? 'abierto' : 'cerrado'}`}>
        <div className="sidebar-title">RepuestosApp</div>

        <Link to="/" className="sidebar-link">
          <FaHome className="sidebar-icon" /> Inicio
        </Link>

        {rol === 'admin' && (
          <Link to="/admin" className="sidebar-link">
            <FaTools className="sidebar-icon" /> Admin
          </Link>
        )}

        <Link to="/perfil" className="sidebar-link">
          <FaUser className="sidebar-icon" /> Perfil
        </Link>

        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt className="sidebar-icon" /> Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default Sidebar;