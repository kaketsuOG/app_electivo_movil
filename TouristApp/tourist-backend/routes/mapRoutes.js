const express = require('express');
const router = express.Router();
const db = require('../config/db');
const haversine = require('haversine-distance');

// Ruta para obtener todos los puntos de interés
router.get('/points', (req, res) => {
    db.query('SELECT * FROM points_of_interest', (err, results) => {
        if (err) {
            console.error('Error al obtener puntos de interés:', err);
            return res.status(500).json({ error: 'Error al obtener puntos de interés' });
        }
        res.json(results);
    });
});

// Ruta para obtener puntos de interés cercanos a una ubicación específica dentro de un radio
router.get('/points/nearby', (req, res) => {
    const { lat, lon, radius } = req.query;
    const userLocation = { latitude: parseFloat(lat), longitude: parseFloat(lon) };

    db.query('SELECT * FROM points_of_interest', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener puntos de interés' });

        const nearbyPoints = results.filter(point => {
            const pointLocation = { latitude: parseFloat(point.latitude), longitude: parseFloat(point.longitude) };
            const distance = haversine(userLocation, pointLocation);
            return distance <= radius;
        });

        res.json(nearbyPoints);
    });
});

// Obtener todas las reseñas de un punto específico
router.get('/points/:pointId/reviews', (req, res) => {
    const { pointId } = req.params;
    const query = 'SELECT * FROM reviews WHERE point_id = ?';

    db.query(query, [pointId], (err, results) => {
        if (err) {
            console.error('Error al obtener las reseñas:', err);
            return res.status(500).json({ error: 'Error al obtener las reseñas' });
        }
        res.json(results);
    });
});

// Añadir una nueva reseña a un punto específico
router.post('/points/:pointId/reviews', (req, res) => {
    const { pointId } = req.params;
    const { rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' });
    }

    const query = 'INSERT INTO reviews (point_id, rating, comment) VALUES (?, ?, ?)';
    db.query(query, [pointId, rating, comment], (err, result) => {
        if (err) {
            console.error('Error al agregar la reseña:', err);
            return res.status(500).json({ error: 'Error al agregar la reseña' });
        }
        res.status(201).json({ message: 'Reseña agregada exitosamente' });
    });
});

module.exports = router;