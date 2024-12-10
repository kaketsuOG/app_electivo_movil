const express = require('express');
const ReviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');  // Asumiendo que tienes este middleware

const router = express.Router();

// Obtener todas las reseñas de un punto específico
router.get('/points/:pointId/reviews', ReviewController.getReviewsByPoint);

// Añadir una nueva reseña a un punto específico
router.post('/points/:pointId/reviews', authMiddleware, ReviewController.addReview);

// Obtener todas las reseñas por un usuario específico
router.get('/user/:userId', authMiddleware, ReviewController.getReviewsByUser);

module.exports = router;