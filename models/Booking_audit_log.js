const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  reservation_id: { type: String, required: true, index: true },
  action: { type: String, required: true }, // 'CREATE', 'UPDATE', 'CANCEL', etc.
  user_id: { type: String, required: true },
  role: { type: String, enum: ['user', 'employee'], required: true },
  previous_state: { type: mongoose.Schema.Types.Mixed, default: null },
  new_state: { type: mongoose.Schema.Types.Mixed, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BookingAudit', auditSchema);