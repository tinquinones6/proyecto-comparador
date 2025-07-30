import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/home';
import CategoryPage from './pages/CategoryPage';
import Login from './pages/login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import AdminPanel from './pages/AdminPanel';
import AdminCommentsPage from './pages/AdminCommentsPage';
import AdminRepuestoForm from './pages/AdminRepuestoForm';
import PrivateRoute from './PrivateRoute';
import { FavoritosProvider } from './context/FavoritosContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles/layout.css';
import './styles/category.css';

function App() {
  return (
    <FavoritosProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          {/* Rutas públicas */}
          <Route index element={<Home />} />
          <Route path="categoria/:categoria" element={<CategoryPage />} />
          <Route path="perfil" element={<Perfil />} />
          
          {/* Rutas protegidas solo para admin */}
          <Route
            path="admin"
            element={
              <PrivateRoute adminOnly>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/comments"
            element={
              <PrivateRoute adminOnly>
                <AdminCommentsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/repuesto/nuevo"
            element={
              <PrivateRoute adminOnly>
                <AdminRepuestoForm />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/repuesto/:id"
            element={
              <PrivateRoute adminOnly>
                <AdminRepuestoForm />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" />
    </FavoritosProvider>
  );
}

export default App;