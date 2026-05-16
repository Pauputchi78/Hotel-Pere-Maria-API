const express = require('express');
const router = express.Router();
const bookingauditcontroller = require('../controllers/BookingAuditController');
const { requireLogin, requireRole } = require('../middleware/authMiddleware');

router.use(requireLogin);
router.get("/:reservation_id/audit", bookingauditcontroller.getAuditHistory);

module.exports = router;