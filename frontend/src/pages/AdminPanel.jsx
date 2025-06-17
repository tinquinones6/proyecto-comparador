import '../styles/admin.css';
import { useState, useEffect } from 'react';
import api from '../config/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaComments, FaEdit, FaTrash, FaSync } from 'react-icons/fa';

function AdminPanel() {
  const rol = localStorage.getItem('rol');
  const navigate = useNavigate();
  const [repuestos, setRepuestos] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: '',
    marca: '',
    modelo: '',
    categoria: ''
  });
  const [repuestosFiltrados, setRepuestosFiltrados] = useState([]);

  useEffect(() => {
    cargarRepuestos();
  }, []);

  useEffect(() => {
    filtrarRepuestos();
  }, [repuestos, filtros]);

  const cargarRepuestos = async () => {
    try {
      const response = await api.get('/repuestos');
      setRepuestos(response.data);
    } catch (err) {
      console.error('Error al cargar repuestos:', err);
      toast.error('Error al cargar los repuestos');
    }
  };

  const filtrarRepuestos = () => {
    let resultados = [...repuestos];
    if (filtros.nombre) {
      resultados = resultados.filter(r =>
        r.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
      );
    }
    if (filtros.marca) {
      resultados = resultados.filter(r =>
        r.marca.toLowerCase().includes(filtros.marca.toLowerCase())
      );
    }
    if (filtros.modelo) {
      resultados = resultados.filter(r =>
        r.modelo.toLowerCase().includes(filtros.modelo.toLowerCase())
      );
    }
    if (filtros.categoria) {
      resultados = resultados.filter(r =>
        r.categoria.toLowerCase().includes(filtros.categoria.toLowerCase())
      );
    }
    setRepuestosFiltrados(resultados);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este repuesto?')) return;
    try {
      await api.delete(`/repuestos/${id}`);
      setRepuestos(repuestos.filter(r => r.id !== id));
      toast.success('Repuesto eliminado correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar el repuesto');
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      nombre: '',
      marca: '',
      modelo: '',
      categoria: ''
    });
  };

  if (rol !== 'admin') {
    return <div className="admin-content">Acceso denegado: solo administradores</div>;
  }

  return (
    <div className="admin-content p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Panel de Administración</h2>

      <div className="admin-buttons">
        <Link to="/admin/repuesto/nuevo" className="btn-accion green">
          <FaPlus /> Agregar Repuesto
        </Link>
        <Link to="/admin/comments" className="btn-accion blue">
          <FaComments /> Gestionar Comentarios
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Filtrar Repuestos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="nombre" value={filtros.nombre} onChange={handleFiltroChange} placeholder="Filtrar por nombre" className="p-2 border rounded" />
          <input name="marca" value={filtros.marca} onChange={handleFiltroChange} placeholder="Filtrar por marca" className="p-2 border rounded" />
          <input name="modelo" value={filtros.modelo} onChange={handleFiltroChange} placeholder="Filtrar por modelo" className="p-2 border rounded" />
          <input name="categoria" value={filtros.categoria} onChange={handleFiltroChange} placeholder="Filtrar por categoría" className="p-2 border rounded" />
        </div>
        <button onClick={limpiarFiltros} className="btn-reset mt-4">
          <FaSync className="mr-2" /> Limpiar filtros
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {repuestosFiltrados.map(repuesto => (
              <tr key={repuesto.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{repuesto.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{repuesto.marca}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{repuesto.modelo}</td>
                <td className="px-6 py-4 text-sm text-gray-500">${repuesto.precio}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{repuesto.categoria}</td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button onClick={() => navigate(`/admin/repuesto/${repuesto.id}`)} className="btn-edit">
                    <FaEdit /> Editar
                  </button>
                  <button onClick={() => handleDelete(repuesto.id)} className="btn-delete">
                    <FaTrash /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;