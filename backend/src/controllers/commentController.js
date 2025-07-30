const Comment = require('../models/Comment');

// Crear un nuevo comentario
exports.createComment = async (req, res) => {
    try {
        const { sparepartId, message, type } = req.body;
        const comment = await Comment.createComment(sparepartId, message, type);
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los comentarios (para administradores)
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.getAllComments();
        res.json(comments);
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener comentarios por repuesto
exports.getCommentsBySparepart = async (req, res) => {
    try {
        const comments = await Comment.getCommentsBySparepart(req.params.sparepartId);
        res.json(comments);
    } catch (error) {
        console.error('Error al obtener comentarios del repuesto:', error);
        res.status(500).json({ message: error.message });
    }
};

// Actualizar estado del comentario (para administradores)
exports.updateCommentStatus = async (req, res) => {
    try {
        const { status, adminResponse } = req.body;
        const updatedComment = await Comment.updateCommentStatus(
            req.params.id,
            status,
            adminResponse
        );
        
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        
        res.json(updatedComment);
    } catch (error) {
        console.error('Error al actualizar comentario:', error);
        res.status(400).json({ message: error.message });
    }
};

// Eliminar comentario (para administradores)
exports.deleteComment = async (req, res) => {
    try {
        const deletedComment = await Comment.deleteComment(req.params.id);
        
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        
        res.json({ success: true, message: 'Comentario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.status(500).json({ message: error.message });
    }
}; 