import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';
import { toast } from 'react-toastify';
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa';

function AdminRepuestoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    modelo: '',
    precio: '',
    tienda: '',
    url: '',
    categoria: ''
  });

  useEffect(() => {
    if (id) {
      cargarRepuesto();
    } else {
      setLoading(false);
    }
  }, [id]);

  const cargarRepuesto = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/repuestos/${id}`);
      if (response.data) {
        setFormData(response.data);
        toast.success('Repuesto cargado correctamente');
      } else {
        toast.error('No se encontró el repuesto');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error al cargar el repuesto:', error);
      toast.error('Error al cargar el repuesto. Verifica que exista.');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        precio: parseFloat(formData.precio)
      };

      if (id) {
        await api.put(`/repuestos/${id}`, dataToSend);
        toast.success('Repuesto actualizado correctamente');
      } else {
        await api.post('/repuestos', dataToSend);
        toast.success('Repuesto agregado correctamente');
      }
      navigate('/admin');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el repuesto. Por favor, verifica los datos.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {id ? 'Editar Repuesto' : 'Agregar Nuevo Repuesto'}
          </h2>
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaTimes className="mr-2" />
            Cancelar
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marca
            </label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo
            </label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tienda
            </label>
            <input
              type="text"
              name="tienda"
              value={formData.tienda}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="md:col-span-2 flex justify-end space-x-4">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {id ? <FaSave className="mr-2" /> : <FaPlus className="mr-2" />}
              {id ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminRepuestoForm; 