/* ============ CONTROLADOR DE RESEÑAS =================

   Funciones:
    - getReviewsByRoom: Obtiene todas las reseñas de una habitación
    - createReview: Crea una reseña (requiere reserva previa, 1 por usuario/hab)
    - deleteReview: Elimina una reseña propia del usuario
   ===================================================== */

const Review = require('../models/Review');
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

/**
 * Recalcula el rate de una habitación basándose en todas sus reseñas
 */
async function recalculateRoomRate(room_id) {
    const reviews = await Review.find({ room_id });
    if (reviews.length === 0) {
        await Room.findOneAndUpdate({ room_id }, { rate: 0 });
        return;
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round((sum / reviews.length) * 10) / 10; // 1 decimal
    await Room.findOneAndUpdate({ room_id }, { rate: avg });
}

/**
 * GET /review/room/:roomId
 * Obtiene todas las reseñas de una habitación (público)
 */
const getReviewsByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const reviews = await Review.find({ room_id: roomId }).sort({ createdAt: -1 });
        return res.status(200).json(reviews);
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

/**
 * POST /review/create
 * Crea una nueva reseña. Validaciones:
 *  1. El usuario debe tener al menos una reserva en esa habitación
 *  2. No puede tener ya una reseña en esa habitación
 */
const createReview = async (req, res) => {
    try {
        const { room_id, rating, comment } = req.body;
        const user_id = req.user.user_id;
        const user_name = req.user.name || 'Usuario';

        // Validar campos obligatorios
        if (!room_id || !rating || !comment) {
            return res.status(400).json({ error: 'room_id, rating y comment son obligatorios' });
        }

        // Verificar que el usuario tiene una reserva en esa habitación
        const reservation = await Reservation.findOne({ room_id, user_id });
        if (!reservation) {
            return res.status(403).json({
                error: 'Solo puedes reseñar habitaciones en las que hayas tenido una reserva'
            });
        }

        // Verificar que no tiene ya una reseña en esa habitación
        const existingReview = await Review.findOne({ room_id, user_id });
        if (existingReview) {
            return res.status(400).json({
                error: 'Ya has dejado una reseña para esta habitación'
            });
        }

        // Crear la reseña
        const review = new Review({
            room_id,
            user_id,
            user_name,
            rating: Number(rating),
            comment
        });
        await review.save();

        // Recalcular el rate de la habitación
        await recalculateRoomRate(room_id);

        return res.status(201).json({
            message: 'Reseña creada correctamente'
        });
    } catch (error) {
        console.error('Error al crear reseña:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

/**
 * DELETE /review/delete
 * Elimina una reseña propia del usuario
 * Body: { review_id }
 */
const deleteReview = async (req, res) => {
    try {
        const { review_id } = req.body;
        const user_id = req.user.user_id;

        if (!review_id) {
            return res.status(400).json({ error: 'review_id es obligatorio' });
        }

        const review = await Review.findOne({ review_id });
        if (!review) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }

        // Solo el autor o un admin pueden borrar
        if (review.user_id !== user_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Solo puedes eliminar tus propias reseñas' });
        }

        const room_id = review.room_id;
        await Review.deleteOne({ review_id });

        // Recalcular el rate de la habitación
        await recalculateRoomRate(room_id);

        return res.status(200).json({ message: 'Reseña eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar reseña:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getReviewsByRoom, createReview, deleteReview };
