import React, { useState, useEffect } from 'react';
import { commentService } from '../services/commentService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await commentService.getAllComments();
      setComments(data);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      if (error.message === 'Token inválido o expirado') {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login');
      } else {
        toast.error('Error al cargar los comentarios: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (commentId) => {
    if (!window.confirm('¿Estás seguro de que deseas marcar este comentario como resuelto?')) {
      return;
    }

    try {
      const response = await commentService.deleteComment(commentId);
      if (response.success) {
        toast.success('Comentario resuelto y eliminado');
        loadComments(); // Recargar la lista completa para asegurar sincronización
      } else {
        toast.error('No se pudo eliminar el comentario');
      }
    } catch (error) {
      console.error('Error al resolver comentario:', error);
      if (error.message === 'Token inválido o expirado') {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login');
      } else {
        toast.error('Error al resolver el comentario: ' + error.message);
      }
    }
  };

  const handleReview = (sparepartId) => {
    // Redirigir al panel de administración
    navigate('/admin');
  };

  if (loading) {
    return <div className="text-center p-4">Cargando comentarios...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Comentarios</h2>
      
      {comments.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No hay comentarios para mostrar</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repuesto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(comment.fecha_creacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comment.repuesto_nombre || comment.sparepartId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comment.tipo === 'price' ? 'Precio' :
                     comment.tipo === 'image' ? 'Imagen' :
                     comment.tipo === 'description' ? 'Descripción' : 'Otro'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                    {comment.mensaje}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      comment.estado === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      comment.estado === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {comment.estado === 'pending' ? 'Pendiente' :
                       comment.estado === 'reviewed' ? 'Revisado' : 'Resuelto'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleReview(comment.sparepartId)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Revisar producto
                      </button>
                      <button
                        onClick={() => handleResolve(comment.id)}
                        className="text-green-600 hover:text-green-900 font-medium"
                      >
                        Resolver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminComments; 