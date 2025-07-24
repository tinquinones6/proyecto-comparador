import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { commentService } from '../services/commentService';
import { toast } from 'react-toastify';
import { FaChevronDown, FaChevronUp, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../styles/commentForm.css';

const CommentForm = ({ sparepartId, onCommentAdded }) => {
  const [comment, setComment] = useState({
    message: '',
    type: 'price'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const token = localStorage.getItem('token');

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
      setIsExpanded(false); // Colapsar después de enviar
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      toast.error('Error al enviar el comentario: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si no hay token, mostrar invitación a registrarse
  if (!token) {
    return (
      <div className="comment-form" style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        margin: '3rem 0 1.5rem 0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        width: '100%',
        position: 'relative'
      }}>
        <div className="comment-form-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.08) 0%, rgba(244, 67, 54, 0.03) 100%)',
          borderBottom: '1px solid rgba(244, 67, 54, 0.12)'
        }}>
          <h3 style={{
            color: '#1f2937',
            fontSize: '1.1rem',
            fontWeight: '600',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>⚠️ Reportar un problema</h3>
        </div>
        
        <div className="login-invitation" style={{
          padding: '2rem',
          textAlign: 'center',
          background: 'white'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <FaSignInAlt size={48} color="var(--text-secondary)" />
          </div>
          
          <h4 style={{
            color: 'var(--text-color)',
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            ¿Encontraste un problema con este producto?
          </h4>
          
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Para reportar problemas con precios, imágenes o descripciones, 
            necesitas tener una cuenta en TuRepuesto.cl
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/login" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--primary-color)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'var(--primary-dark)'}
              onMouseOut={(e) => e.target.style.background = 'var(--primary-color)'}
            >
              <FaSignInAlt /> Iniciar Sesión
            </Link>
            
            <Link 
              to="/register" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: 'var(--primary-color)',
                textDecoration: 'none',
                borderRadius: '8px',
                border: '2px solid var(--primary-color)',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'var(--primary-color)';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--primary-color)';
              }}
            >
              <FaUserPlus /> Crear Cuenta
            </Link>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--background-secondary)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            💡 <strong>¿Por qué crear una cuenta?</strong><br />
            Además de reportar problemas, podrás guardar favoritos y gestionar tus vehículos
          </div>
        </div>
      </div>
    );
  }

  // Usuario autenticado - mostrar formulario normal
  return (
    <div className="comment-form" style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      margin: '3rem 0 1.5rem 0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      width: '100%',
      position: 'relative'
    }}>
      <div 
        className="comment-form-header" 
        onClick={() => setIsExpanded(!isExpanded)}
        title="Haz clic para reportar un problema con este producto"
        role="button"
        tabIndex={0}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.08) 0%, rgba(244, 67, 54, 0.03) 100%)',
          borderBottom: '1px solid rgba(244, 67, 54, 0.12)'
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <h3 style={{
          color: '#1f2937',
          fontSize: '1.1rem',
          fontWeight: '600',
          margin: '0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>⚠️ Reportar un problema</h3>
        <div className="comment-form-toggle" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(244, 67, 54, 0.05)',
          border: '1px solid rgba(244, 67, 54, 0.1)'
        }}>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      
      {isExpanded && (
        <form onSubmit={handleSubmit} style={{
          padding: '2rem',
          background: 'white',
          borderTop: '1px solid rgba(244, 67, 54, 0.1)'
        }}>
          <div className="comment-form-group" style={{marginBottom: '1.5rem'}}>
            <label htmlFor="comment-type" style={{
              display: 'block',
              color: '#1f2937',
              fontSize: '0.95rem',
              fontWeight: '600',
              marginBottom: '0.75rem'
            }}>
              Tipo de problema *
            </label>
            <select
              id="comment-type"
              value={comment.type}
              onChange={(e) => setComment({ ...comment, type: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                background: 'white',
                color: '#1f2937',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            >
              <option value="price">Precio incorrecto</option>
              <option value="image">Problema con la imagen</option>
              <option value="description">Descripción incorrecta</option>
              <option value="other">Otro problema</option>
            </select>
          </div>

          <div className="comment-form-group" style={{marginBottom: '2rem'}}>
            <label htmlFor="comment-message" style={{
              display: 'block',
              color: '#1f2937',
              fontSize: '0.95rem',
              fontWeight: '600',
              marginBottom: '0.75rem'
            }}>
              Descripción del problema *
            </label>
            <textarea
              id="comment-message"
              value={comment.message}
              onChange={(e) => setComment({ ...comment, message: e.target.value })}
              rows="4"
              required
              placeholder="Describe detalladamente el problema que has encontrado con este producto..."
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                background: 'white',
                color: '#1f2937',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                minHeight: '120px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !comment.message.trim()}
            className="comment-form-submit"
            style={{
              width: '100%',
              padding: '1rem 2rem',
              background: isSubmitting ? '#9e9e9e' : 'linear-gradient(135deg, #dc2626, #e53935, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)'
            }}
          >
            {isSubmitting ? 'Enviando reporte...' : 'Enviar reporte'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentForm; 