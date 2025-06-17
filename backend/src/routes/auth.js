const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isAdmin } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET;

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

// Registro
router.post('/register', async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const resultado = await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, hashedPassword, rol || 'cliente']
        );

        res.json({ mensaje: 'Usuario registrado exitosamente', usuario: resultado.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = resultado.rows[0];
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol, email: usuario.email },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ mensaje: 'Login exitoso', token, rol: usuario.rol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Obtener perfil
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id, nombre, email, rol FROM usuarios WHERE id = $1',
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
            'UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3',
            [nombre, email, req.user.id]
        );
        const updated = await pool.query(
            'SELECT id, nombre, email, rol FROM usuarios WHERE id = $1',
            [req.user.id]
        );
        res.json(updated.rows[0]);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar perfil' });
    }
});

module.exports = router;