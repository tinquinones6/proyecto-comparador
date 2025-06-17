const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

// Middleware de autenticación básica
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// Obtener favoritos del usuario
router.get('/', authMiddleware, async (req, res) => {
    try {
        const favoritos = await pool.query(
            'SELECT f.*, r.* FROM favoritos f JOIN repuestos r ON f.repuesto_id = r.id WHERE f.usuario_id = $1',
            [req.user.id]
        );
        res.json(favoritos.rows);
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({ message: 'Error al obtener favoritos' });
    }
});

// Agregar favorito
router.post('/', authMiddleware, async (req, res) => {
    const { repuestoId } = req.body;
    try {
        // Verificar si ya existe el favorito
        const existente = await pool.query(
            'SELECT * FROM favoritos WHERE usuario_id = $1 AND repuesto_id = $2',
            [req.user.id, repuestoId]
        );

        if (existente.rows.length > 0) {
            return res.status(400).json({ message: 'Este repuesto ya está en favoritos' });
        }

        // Agregar nuevo favorito
        const resultado = await pool.query(
            'INSERT INTO favoritos (usuario_id, repuesto_id) VALUES ($1, $2) RETURNING *',
            [req.user.id, repuestoId]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al agregar favorito:', error);
        res.status(500).json({ message: 'Error al agregar favorito' });
    }
});

// Eliminar favorito
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const resultado = await pool.query(
            'DELETE FROM favoritos WHERE repuesto_id = $1 AND usuario_id = $2 RETURNING *',
            [req.params.id, req.user.id]
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