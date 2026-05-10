// Rutas para reservas
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { requireLogin, requireRole } = require('../middleware/authMiddleware');

router.get("/:reservation_id/invoice", reservationController.generateInvoice);

// Todas requieren estar autenticado
router.use(requireLogin);

// Añadir Reserva
router.post('/add', reservationController.addReservation);
// Eliminar y modificar reserva
router.post('/cancel', reservationController.cancelReservation);
router.put('/update', reservationController.updateReservation);

// Obtener reservas
router.use('/mine',reservationController.getMine);
router.use("/getPrice" ,reservationController.calculatePrice);
router.use("/getCancelationPrice", reservationController.calculateCancelationPrice);

router.use(requireRole(['admin','employee']));

router.get('/one',reservationController.getReservation);
router.get('/all', reservationController.getAllReservations);
router.get('/allActive', reservationController.getActiveReservations);

module.exports = router;