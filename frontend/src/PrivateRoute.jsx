import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && rol !== 'admin') {
    // Si requiere admin y el usuario no es admin, redirige al home
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;