const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const { obtenerFavoritos, agregarFavorito, eliminarFavorito } = require('../models/favoritosModel');

// Middleware de autenticación básica
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Cambiado a req.usuario para consistencia
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// Obtener favoritos del usuario
router.get('/', authMiddleware, async (req, res) => {
    try {
        const favoritos = await obtenerFavoritos(req.usuario.id);
        res.json(favoritos);
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({ message: 'Error al obtener favoritos' });
    }
});

// Agregar favorito
router.post('/', authMiddleware, async (req, res) => {
    const { repuestoId } = req.body;
    console.log('🔍 Debug agregar favorito:');
    console.log('  - req.body:', req.body);
    console.log('  - repuestoId:', repuestoId);
    console.log('  - usuario.id:', req.usuario.id);
    
    try {
        // Verificar si ya existe el favorito
        const existente = await pool.query(
            'SELECT * FROM favoritos WHERE id_usuario = $1 AND id_repuesto = $2',
            [req.usuario.id, repuestoId]
        );

        if (existente.rows.length > 0) {
            return res.status(400).json({ message: 'Este repuesto ya está en favoritos' });
        }

        // Usar el modelo para agregar favorito
        const resultado = await agregarFavorito(req.usuario.id, repuestoId);
        res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al agregar favorito:', error);
        res.status(500).json({ message: 'Error al agregar favorito' });
    }
});

// Eliminar favorito
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // El :id en la URL es el id_favorito, no el id_repuesto
        const favoritoId = req.params.id;
        
        console.log('🔍 Debug eliminar favorito:');
        console.log('  - favoritoId (req.params.id):', favoritoId);
        console.log('  - usuario.id:', req.usuario.id);
        
        // Eliminar por id_favorito y verificar que pertenece al usuario
        const resultado = await pool.query(
            'DELETE FROM favoritos WHERE id_favorito = $1 AND id_usuario = $2 RETURNING *',
            [favoritoId, req.usuario.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ message: 'Favorito no encontrado' });
        }

        res.json({ message: 'Favorito eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar favorito:', error);
        res.status(500).json({ message: 'Error al eliminar favorito' });
    }
});

module.exports = router;