import React, { useState } from 'react';
import { commentService } from '../services/commentService';
import { toast } from 'react-toastify';

const CommentForm = ({ sparepartId, onCommentAdded }) => {
  const [comment, setComment] = useState({
    message: '',
    type: 'price'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await commentService.createComment(
        sparepartId,
        comment.message,
        comment.type
      );
      toast.success('Comentario enviado con éxito');
      setComment({ message: '', type: 'price' });
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      toast.error('Error al enviar el comentario: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Reportar un problema</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de problema
          </label>
          <select
            value={comment.type}
            onChange={(e) => setComment({ ...comment, type: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="price">Precio incorrecto</option>
            <option value="image">Problema con la imagen</option>
            <option value="description">Descripción incorrecta</option>
            <option value="other">Otro problema</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje
          </label>
          <textarea
            value={comment.message}
            onChange={(e) => setComment({ ...comment, message: e.target.value })}
            className="w-full p-2 border rounded-md"
            rows="3"
            required
            placeholder="Describe el problema que has encontrado..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm; 