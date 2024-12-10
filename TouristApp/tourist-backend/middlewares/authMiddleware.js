const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err);
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }
        req.userId = decoded.id; // Decodifica y agrega el userId al objeto req
        console.log('Usuario autenticado, ID:', req.userId);
        next();
    });
};