const express = require('express');
const router = express.Router();
const hotelconfigController = require('../controllers/hotelconfigController');
const { requireLogin, requireRole } = require('../middleware/authMiddleware');

router.use(requireLogin);

router.get('/getconfig', hotelconfigController.getConfig);
router.put('/update', hotelconfigController.modconfig);

module.exports = router;