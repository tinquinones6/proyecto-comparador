const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
    try {
        // Obtener el token del header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar si es admin
        if (decoded.rol !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado: se requieren permisos de administrador' });
        }

        // Agregar el usuario decodificado a la request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = {
    isAdmin
};