const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const resultado = await pool.query('SELECT * FROM usuario WHERE correo = $1', [email]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = resultado.rows[0];
        const passwordValida = await bcrypt.compare(password, usuario.contrasena);

        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol, email: usuario.correo },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ mensaje: 'Login exitoso', token, rol: usuario.rol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
