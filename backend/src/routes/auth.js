const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const vehiculosUsuarioController = require('../controllers/vehiculosUsuarioController');

const JWT_SECRET = process.env.JWT_SECRET;

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ mensaje: 'Rutas de auth funcionando correctamente' });
});

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded; // Cambiado de req.user a req.usuario para consistencia
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
            'SELECT id_usuario as id, nombre, correo as email FROM usuario WHERE id_usuario = $1',
            [req.usuario.id]
        );
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener perfil' });
    }
});

// Actualizar perfil
router.put('/perfil', authMiddleware, async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        if (password) {
            // Si se proporciona una nueva contraseña, hashearla y actualizar todo
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query(
                'UPDATE usuario SET nombre = $1, correo = $2, contrasena = $3 WHERE id_usuario = $4',
                [nombre, email, hashedPassword, req.usuario.id]
            );
        } else {
            // Si no hay nueva contraseña, solo actualizar nombre y email
            await pool.query(
                'UPDATE usuario SET nombre = $1, correo = $2 WHERE id_usuario = $3',
                [nombre, email, req.usuario.id]
            );
        }
        
        const updated = await pool.query(
            'SELECT id_usuario as id, nombre, correo as email FROM usuario WHERE id_usuario = $1',
            [req.usuario.id]
        );
        res.json(updated.rows[0]);
    } catch (err) {
        console.error('Error al actualizar perfil:', err);
        res.status(500).json({ mensaje: 'Error al actualizar perfil' });
    }
});

// === RUTAS DE VEHÍCULOS DEL USUARIO ===

// Obtener marcas disponibles
router.get('/marcas', vehiculosUsuarioController.obtenerMarcas);

// Obtener modelos por marca
router.get('/marcas/:marcaId/modelos', vehiculosUsuarioController.obtenerModelosPorMarca);

// Obtener vehículos del usuario
router.get('/vehiculos', authMiddleware, vehiculosUsuarioController.obtenerVehiculosUsuario);

// Agregar vehículo
router.post('/vehiculos', authMiddleware, vehiculosUsuarioController.agregarVehiculo);

// Actualizar vehículo
router.put('/vehiculos/:id', authMiddleware, vehiculosUsuarioController.actualizarVehiculo);

// Eliminar vehículo
router.delete('/vehiculos/:id', authMiddleware, vehiculosUsuarioController.eliminarVehiculo);

// Marcar vehículo como principal
router.patch('/vehiculos/:id/principal', authMiddleware, vehiculosUsuarioController.marcarComoPrincipal);

module.exports = router;
