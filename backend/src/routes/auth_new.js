const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ mensaje: 'Rutas de auth funcionando correctamente' });
});

// Middleware de autenticación básica
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// Login
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    console.log('🔐 Intento de login:', { correo, contrasena: contrasena ? '***' : 'undefined' });

    try {
        const resultado = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);
        console.log('👤 Usuario encontrado:', resultado.rows.length > 0 ? 'Sí' : 'No');

        if (resultado.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = resultado.rows[0];
        console.log('🔍 Datos del usuario:', { id: usuario.id_usuario, correo: usuario.correo, rol: usuario.rol });
        
        const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
        console.log('🔑 Contraseña válida:', passwordValida);

        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol, correo: usuario.correo },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ mensaje: 'Login exitoso', token, rol: usuario.rol });
    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Registro
router.post('/register', async (req, res) => {
    const { nombre, correo, contrasena, rol } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const resultado = await pool.query(
            'INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, correo, hashedPassword, rol || 'cliente']
        );

        res.json({ mensaje: 'Usuario registrado exitosamente', usuario: resultado.rows[0] });
    } catch (error) {
        console.error('❌ Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Obtener perfil
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id_usuario as id, nombre, correo as email, rol FROM usuario WHERE id_usuario = $1',
            [req.user.id]
        );
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener perfil' });
    }
});

// Actualizar perfil
router.put('/perfil', authMiddleware, async (req, res) => {
    const { nombre, email } = req.body;
    try {
        await pool.query(
            'UPDATE usuario SET nombre = $1, correo = $2 WHERE id_usuario = $3',
            [nombre, email, req.user.id]
        );
        const updated = await pool.query(
            'SELECT id_usuario as id, nombre, correo as email, rol FROM usuario WHERE id_usuario = $1',
            [req.user.id]
        );
        res.json(updated.rows[0]);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar perfil' });
    }
});

module.exports = router;
