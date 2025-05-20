import '../styles/admin.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function AdminPanel() {
  const rol = localStorage.getItem('rol');
  const [repuestos, setRepuestos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    modelo: '',
    precio: '',
    tienda: '',
    url: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchRepuestos();
  }, []);

  const fetchRepuestos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/repuestos');
      setRepuestos(response.data);
    } catch (err) {
      console.error('Error al cargar repuestos:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        const response = await axios.put(`http://localhost:3000/api/repuestos/${editId}`, {
          ...formData,
          precio: parseFloat(formData.precio)
        });
        setRepuestos(repuestos.map(r => (r.id === editId ? response.data : r)));
        setEditId(null);
      } else {
        const response = await axios.post('http://localhost:3000/api/repuestos', {
          ...formData,
          precio: parseFloat(formData.precio)
        });
        setRepuestos([...repuestos, response.data]);
      }

      setFormData({
        nombre: '',
        marca: '',
        modelo: '',
        precio: '',
        tienda: '',
        url: ''
      });

    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (repuesto) => {
    setFormData({
      nombre: repuesto.nombre,
      marca: repuesto.marca,
      modelo: repuesto.modelo,
      precio: repuesto.precio,
      tienda: repuesto.tienda,
      url: repuesto.url
    });
    setEditId(repuesto.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este repuesto?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/repuestos/${id}`);
      setRepuestos(repuestos.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (rol !== 'admin') {
    return <div className="p-4 text-red-500">Acceso denegado: solo administradores</div>;
  }

  return (
    <div>
      <Sidebar />
      <div className="main-content">
        <h2>Panel de Administración</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="marca" placeholder="Marca" value={formData.marca} onChange={handleChange} required />
          <input type="text" name="modelo" placeholder="Modelo" value={formData.modelo} onChange={handleChange} required />
          <input type="number" name="precio" placeholder="Precio" value={formData.precio} onChange={handleChange} required />
          <input type="text" name="tienda" placeholder="Tienda" value={formData.tienda} onChange={handleChange} required />
          <input type="url" name="url" placeholder="Link de compra" value={formData.url} onChange={handleChange} required />
          <button type="submit" className="add-button">
            {editId ? 'Actualizar repuesto' : 'Agregar repuesto'}
          </button>
        </form>

        <h3>Lista de Repuestos</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Precio</th>
              <th>Tienda</th>
              <th>Link</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {repuestos.map(r => (
              <tr key={r.id}>
                <td>{r.nombre}</td>
                <td>{r.marca}</td>
                <td>{r.modelo}</td>
                <td>{r.precio} CLP</td>
                <td>{r.tienda}</td>
                <td><a href={r.url} target="_blank">Comprar</a></td>
                <td>
                  <button onClick={() => handleEdit(r)} className="edit-button">Editar</button>
                  <button onClick={() => handleDelete(r.id)} className="delete-button">Eliminar</button>
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