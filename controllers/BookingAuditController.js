const BookingAudit = require('../models/Booking_audit_log');

async function createAuditLog(reservation_id, action, req, oldState = null, newState = null) {
  try {
    const log = new BookingAudit({
      reservation_id: reservation_id,
      action: action,
      user_id: req.user.user_id,
      role: req.user.role === 'employee' ? 'employee' : 'user',
      previous_state: oldState,
      new_state: newState
    });
    const logGuardado = await log.save();
    console.log(`Auditoría registrada: ${action} para la reserva ${reservation_id} (ID Log: ${logGuardado._id})`);
  } catch (err) {
    console.error("Error guardando auditoría:", err);
  }
}

const getAuditHistory = async (req, res) => {
    try {
        const { reservation_id } = req.params;
        const history = await BookingAudit.find({ reservation_id: reservation_id }).sort({ timestamp: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener el historial" });
    }
};

// Exportas ambos
module.exports = {
    createAuditLog,
    getAuditHistory
};