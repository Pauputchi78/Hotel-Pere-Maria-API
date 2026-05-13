const express = require('express');
const router = express.Router();
const invoicecontroller = require('../controllers/invoiceController');
const { requireLogin, requireRole } = require('../middleware/authMiddleware');

router.use(requireLogin);
router.use(requireRole(['admin','employee']));

router.get('/all', invoicecontroller.getAllInvoices);

module.exports = router;