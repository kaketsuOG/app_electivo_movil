const Review = require('../models/reviewModel'); // Asegúrate de que este modelo exista y esté bien configurado

const ReviewController = {
    getReviewsByPoint: async (req, res) => {
        const { pointId } = req.params;
        try {
            const reviews = await Review.findByPointId(pointId);
            res.json(reviews);
        } catch (error) {
            console.error('Error al obtener las reseñas:', error);
            res.status(500).json({ error: 'Error al obtener las reseñas' });
        }
    },

    getReviewsByUser: async (req, res) => {
        const { userId } = req.params;
        console.log('User ID recibido en la solicitud:', userId); // Log del parámetro recibido
        try {
            const reviews = await Review.findByUserId(userId);
            console.log('Reseñas encontradas:', reviews); // Log de las reseñas encontradas
            if (reviews.length > 0) {
                res.json(reviews);
            } else {
                res.status(404).json({ message: "No reviews found for this user" });
            }
        } catch (error) {
            console.error('Error al obtener las reseñas del usuario:', error);
            res.status(500).json({ error: 'Error al obtener las reseñas del usuario' });
        }
    },

    addReview: async (req, res) => {
        const { pointId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.userId; // ID del usuario extraído por el authMiddleware

        console.log('Datos recibidos:');
        console.log('Point ID:', pointId);
        console.log('Rating:', rating);
        console.log('Comment:', comment);
        console.log('User ID:', userId);

        if (!userId) {
            return res.status(400).json({ error: 'No se pudo autenticar al usuario' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' });
        }

        try {
            const result = await Review.addReview(userId, pointId, rating, comment);
            console.log('Reseña agregada con éxito:', result);
            res.status(201).json({ message: 'Reseña agregada exitosamente', reviewId: result.insertId });
        } catch (error) {
            console.error('Error al agregar la reseña:', error);
            res.status(500).json({ error: 'Error al agregar la reseña' });
        }

    }
};

module.exports = ReviewController;