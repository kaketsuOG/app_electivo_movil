const express = require('express');
const router = express.Router();
const db = require('../config/firebase');
const haversine = require('haversine-distance');
const admin = require('firebase-admin');

// Ruta para obtener todos los puntos de interés
router.get('/points', async (req, res) => {
    try {
        const pointsSnapshot = await db.collection('points_of_interest').get();
        const points = pointsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(points);
    } catch (err) {
        console.error('Error al obtener puntos de interés:', err);
        res.status(500).json({ error: 'Error al obtener puntos de interés' });
    }
});

// Ruta para obtener puntos de interés cercanos a una ubicación específica dentro de un radio
router.get('/points/nearby', async (req, res) => {
    const { lat, lon, radius } = req.query;
    const userLocation = { latitude: parseFloat(lat), longitude: parseFloat(lon) };

    try {
        const pointsSnapshot = await db.collection('points_of_interest').get();
        const nearbyPoints = pointsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(point => {
                const pointLocation = { latitude: parseFloat(point.latitude), longitude: parseFloat(point.longitude) };
                const distance = haversine(userLocation, pointLocation);
                return distance <= radius;
            });

        res.json(nearbyPoints);
    } catch (err) {
        console.error('Error al obtener puntos de interés cercanos:', err);
        res.status(500).json({ error: 'Error al obtener puntos de interés cercanos' });
    }
});

// Obtener todas las reseñas de un punto específico
router.get('/points/:pointId/reviews', async (req, res) => {
    const { pointId } = req.params;

    try {
        const reviewsSnapshot = await db.collection('points_of_interest').doc(pointId).collection('reviews').get();
        const reviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(reviews);
    } catch (err) {
        console.error('Error al obtener las reseñas:', err);
        res.status(500).json({ error: 'Error al obtener las reseñas' });
    }
});

// Ruta para añadir una nueva reseña a un punto específico
router.post('/points/:pointId/reviews', async (req, res) => {
    const { pointId } = req.params;
    const { rating, comment, idToken } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' });
    }

    try {
        // Verificar el token de autenticación
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // Referencia al documento del punto
        const pointRef = db.collection('points_of_interest').doc(pointId);
        const point = await pointRef.get();

        if (!point.exists) {
            return res.status(404).json({ error: 'Punto de interés no encontrado' });
        }

        // Crear la reseña en una subcolección
        await pointRef.collection('reviews').add({
            rating: Number(rating),
            comment,
            userId,
            created_at: admin.firestore.FieldValue.serverTimestamp()
        });

        // Actualizar el promedio de calificaciones del punto
        const reviewsSnapshot = await pointRef.collection('reviews').get();
        const reviews = reviewsSnapshot.docs.map(doc => doc.data());
        const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

        await pointRef.update({
            average_rating: averageRating,
            total_reviews: reviews.length
        });

        res.status(201).json({
            message: 'Reseña agregada exitosamente',
            average_rating: averageRating,
            total_reviews: reviews.length
        });
    } catch (err) {
        console.error('Error al agregar la reseña:', err);
        res.status(500).json({ error: 'Error al agregar la reseña', details: err.message });
    }
});

module.exports = router;