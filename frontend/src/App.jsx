import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/home';
import Login from './pages/login';
import Perfil from './pages/Perfil';
import AdminPanel from './pages/AdminPanel';
import AdminCommentsPage from './pages/AdminCommentsPage';
import AdminRepuestoForm from './pages/AdminRepuestoForm';
import PrivateRoute from './PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles/layout.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="admin/comments" element={<AdminCommentsPage />} />
          <Route path="admin/repuesto/nuevo" element={<AdminRepuestoForm />} />
          <Route path="admin/repuesto/:id" element={<AdminRepuestoForm />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;