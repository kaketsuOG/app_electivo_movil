const express = require('express');
const PoiController = require('../controllers/poiController'); // Asegúrate de que el nombre del archivo coincida con cómo está nombrado y ubicado
const authMiddleware = require('../middlewares/authMiddleware'); // Si planeas usar autenticación

const router = express.Router();

// Obtener todos los puntos de interés
router.get('/', PoiController.getAllPoints);

// Obtener puntos de interés cercanos a una ubicación específica dentro de un radio
router.get('/nearby', PoiController.getNearbyPoints);

module.exports = router;