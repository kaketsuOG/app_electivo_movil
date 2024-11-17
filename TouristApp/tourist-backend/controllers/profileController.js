const User = require('../models/userModel');

// Obtener el perfil del usuario
const getProfile = async (req, res) => {
    try {
        const userId = req.userId; // Cambiado a req.userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user); // Devuelve los datos del usuario
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el perfil' });
    }
};

// Actualizar el email del usuario
const updateEmail = async (req, res) => {
    try {
        const userId = req.userId; // Cambiado a req.userId
        const { email } = req.body;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        const result = await User.updateEmail(userId, email);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Email actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el email' });
    }
};

// Actualizar el nombre de usuario del usuario
const updateUsername = async (req, res) => {
    try {
        const userId = req.userId; // Cambiado a req.userId
        const { username } = req.body;

        if (!username || username.length < 3) {
            return res.status(400).json({ error: 'El nombre de usuario debe tener al menos 3 caracteres' });
        }

        const result = await User.updateUsername(userId, username);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Nombre de usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el nombre de usuario' });
    }
};

// Actualizar el perfil completo (nombre de usuario y email)
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId; // Cambiado a req.userId
        const { username, email } = req.body;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        if (!username || username.length < 3) {
            return res.status(400).json({ error: 'El nombre de usuario debe tener al menos 3 caracteres' });
        }

        const result = await User.updateProfile(userId, username, email);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Perfil actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
};

module.exports = {
    getProfile,
    updateEmail,
    updateUsername,
    updateProfile,
};
