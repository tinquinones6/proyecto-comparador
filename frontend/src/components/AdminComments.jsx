import React, { useState, useEffect, useCallback } from 'react';
import { commentService } from '../services/commentService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaEdit, FaTrash, FaEye, FaCheckCircle, FaCheck } from 'react-icons/fa';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await commentService.getAllComments();
      setComments(data);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      if (error.message === 'Token inválido o expirado') {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login');
      } else if (!toast.isActive('comments-error')) {
        toast.error('Error al cargar los comentarios', { toastId: 'comments-error' });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleMarkAsReviewed = async (commentId) => {
    if (!window.confirm('¿Estás seguro de que deseas marcar este comentario como revisado?')) {
      return;
    }

    try {
      setIsUpdating(true);
      
      // Primero descartar cualquier toast previo para este comentario
      toast.dismiss(`reviewed-${commentId}`);
      toast.dismiss(`error-reviewed-${commentId}`);
      
      const response = await commentService.updateCommentStatus(commentId, 'reviewed');
      if (response.success) {
        // Actualizar el estado local sin recargar toda la lista
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === commentId 
              ? { ...comment, estado: 'reviewed' }
              : comment
          )
        );
        toast.success('Comentario marcado como revisado', { 
          toastId: `reviewed-${commentId}`,
          autoClose: 3000
        });
      } else {
        toast.error('No se pudo actualizar el comentario', { 
          toastId: `error-reviewed-${commentId}`,
          autoClose: 5000
        });
      }
    } catch (error) {
      console.error('Error al marcar como revisado:', error);
      if (error.message === 'Token inválido o expirado') {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login');
      } else {
        toast.error('Error al actualizar el comentario', { 
          toastId: `error-reviewed-${commentId}`,
          autoClose: 5000
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResolve = async (commentId) => {
    if (!window.confirm('¿Estás seguro de que deseas marcar este comentario como resuelto y eliminarlo?')) {
      return;
    }

    try {
      setIsUpdating(true);
      
      // Descartar toasts previos para este comentario
      toast.dismiss(`resolved-${commentId}`);
      toast.dismiss(`error-resolved-${commentId}`);
      
      const response = await commentService.deleteComment(commentId);
      if (response.success) {
        // Actualizar el estado local removiendo el comentario
        setComments(prevComments => 
          prevComments.filter(comment => comment.id !== commentId)
        );
        toast.success('Comentario resuelto y eliminado', { 
          toastId: `resolved-${commentId}`,
          autoClose: 3000
        });
      } else {
        toast.error('No se pudo eliminar el comentario', { 
          toastId: `error-resolved-${commentId}`,
          autoClose: 5000
        });
      }
    } catch (error) {
      console.error('Error al resolver comentario:', error);
      if (error.message === 'Token inválido o expirado') {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login');
      } else {
        toast.error('Error al resolver el comentario', { 
          toastId: `error-resolved-${commentId}`,
          autoClose: 5000
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReview = (sparepartId, repuestoNombre) => {
    // Mostrar confirmación antes de redirigir
    const confirmar = window.confirm(
      `¿Deseas ir al formulario de edición para corregir el repuesto "${repuestoNombre}"?`
    );
    
    if (confirmar) {
      // Redirigir directamente al formulario de edición del repuesto con parámetro de origen
      navigate(`/admin/repuesto/${sparepartId}?from=comments`);
      // Remover el toast.info para evitar notificaciones excesivas
    }
  };

  if (loading) {
    return <div className="text-center p-4">Cargando comentarios...</div>;
  }

  return (
    <div className="admin-content">
      <div className="admin-section">
        <h2 className="admin-section-title">
          <FaComments /> Gestión de Comentarios
        </h2>
        
        {comments.length === 0 ? (
          <div className="admin-empty-state">
            <p>No hay comentarios para mostrar</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Repuesto</th>
                  <th>Tipo</th>
                  <th>Mensaje</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id}>
                    <td>
                      {new Date(comment.fecha_creacion).toLocaleDateString()}
                    </td>
                    <td className="table-cell-name">
                      {comment.repuesto_nombre || `Repuesto ID: ${comment.repuesto_id}`}
                    </td>
                    <td>
                      <span className={`comment-type-indicator comment-type-${comment.tipo}`}>
                        {comment.tipo === 'price' ? 'Precio' :
                         comment.tipo === 'image' ? 'Imagen' :
                         comment.tipo === 'description' ? 'Descripción' : 'Otro'}
                      </span>
                    </td>
                    <td className="table-cell-comment-message" title={comment.mensaje}>
                      {comment.mensaje}
                    </td>
                    <td>
                      <span className={`comment-status comment-status-${comment.estado}`}>
                        {comment.estado === 'pending' ? 'Pendiente' :
                         comment.estado === 'reviewed' ? 'Revisado' : 'Resuelto'}
                      </span>
                    </td>
                    <td className="table-cell-actions">
                      <button
                        onClick={() => handleReview(comment.repuesto_id, comment.repuesto_nombre)}
                        className="admin-btn-icon admin-btn-edit"
                        title="Editar producto para corregir error"
                        disabled={isUpdating}
                      >
                        <FaEdit />
                      </button>
                      {comment.estado === 'pending' && (
                        <button
                          onClick={() => handleMarkAsReviewed(comment.id)}
                          className="admin-btn-icon admin-btn-review"
                          title="Marcar como revisado"
                          disabled={isUpdating}
                        >
                          <FaEye />
                        </button>
                      )}
                      {comment.estado === 'reviewed' && (
                        <div
                          className="admin-btn-icon admin-btn-success"
                          title="Comentario revisado"
                          style={{ cursor: 'default' }}
                        >
                          <FaCheck />
                        </div>
                      )}
                      <button
                        onClick={() => handleResolve(comment.id)}
                        className="admin-btn-icon admin-btn-delete"
                        title="Marcar como resuelto y eliminar"
                        disabled={isUpdating}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComments; 