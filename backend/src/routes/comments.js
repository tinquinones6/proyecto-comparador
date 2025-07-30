const express = require('express');
const router = express.Router();
const {
    createComment,
    getAllComments,
    getCommentsBySparepart,
    updateCommentStatus,
    deleteComment
} = require('../controllers/commentController');
const { isAdmin } = require('../middleware/auth');

// Rutas públicas
router.post('/', createComment);
router.get('/sparepart/:sparepartId', getCommentsBySparepart);

// Rutas protegidas (solo administradores)
router.get('/', isAdmin, getAllComments);
router.patch('/:id', isAdmin, updateCommentStatus);
router.delete('/:id', isAdmin, deleteComment);

module.exports = router; 