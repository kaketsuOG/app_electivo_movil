const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener el perfil del usuario
router.get('/', authMiddleware, profileController.getProfile);

// Actualizar email
router.put('/email', authMiddleware, profileController.updateEmail);

// Actualizar nombre de usuario
router.put('/username', authMiddleware, profileController.updateUsername);

// Actualizar perfil completo
router.put('/', authMiddleware, profileController.updateProfile);

module.exports = router;

