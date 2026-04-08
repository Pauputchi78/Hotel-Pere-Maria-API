/* =====================================================
   =================== RESEÑA ==========================
   =====================================================

   Modelo para las reseñas de habitaciones.
   Cada reseña vincula un usuario con una habitación y contiene:
    - review_id: Identificador único auto-generado (REV-XXXXX)
    - room_id: Referencia a la habitación (HAB-XXX)
    - user_id: Referencia al usuario que escribió la reseña (CLI-XXXXX)
    - user_name: Nombre del autor (para visualización sin consulta extra)
    - rating: Puntuación de 1 a 5
    - comment: Texto de la reseña (máx. 500 caracteres)
   ===================================================== */

const mongoose = require('mongoose');

// Contador auto-incremental para review_id
const counterSchema = new mongoose.Schema({
    _id: String,
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const reviewSchema = new mongoose.Schema({
    review_id: {
        type: String,
        unique: true,
        trim: true
    },
    room_id: {
        type: String,
        required: [true, 'El ID de la habitación es obligatorio'],
        trim: true
    },
    user_id: {
        type: String,
        required: [true, 'El ID del usuario es obligatorio'],
        trim: true
    },
    user_name: {
        type: String,
        required: [true, 'El nombre del usuario es obligatorio'],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'La puntuación es obligatoria'],
        min: [1, 'La puntuación mínima es 1'],
        max: [5, 'La puntuación máxima es 5']
    },
    comment: {
        type: String,
        required: [true, 'El comentario es obligatorio'],
        trim: true,
        maxlength: [500, 'El comentario no puede superar los 500 caracteres']
    }
}, {
    timestamps: true
});

// Generar review_id automáticamente antes de guardar
reviewSchema.pre('save', async function () {
    if (!this.review_id) {
        const counter = await Counter.findByIdAndUpdate(
            'review_id',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.review_id = `REV-${String(counter.seq).padStart(5, '0')}`;
    }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
