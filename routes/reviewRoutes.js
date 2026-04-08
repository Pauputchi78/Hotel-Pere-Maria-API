/* ============= ROUTES DE RESEÑAS =====================

   Rutas:
    - GET  /review/room/:roomId  → Obtener reseñas de una habitación (público)
    - POST /review/create        → Crear reseña (requiere login)
    - DELETE /review/delete      → Eliminar reseña propia (requiere login)
*/

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireLogin } = require('../middleware/authMiddleware');

// Obtener reseñas de una habitación (público, no requiere token)
router.get('/room/:roomId', reviewController.getReviewsByRoom);

// Crear una reseña (requiere estar logueado)
router.post('/create', requireLogin, reviewController.createReview);

// Eliminar una reseña (requiere estar logueado)
router.delete('/delete', requireLogin, reviewController.deleteReview);

module.exports = router;
