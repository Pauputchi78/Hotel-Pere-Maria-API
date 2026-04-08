// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// Login
//POST /api/auth/login
router.post('/login', authController.login);

//Logout
//POST /api/auth/logout
router.post('/logout', authController.logout);

//Recuperar contraseña (ruta publica, el usuario no esta logueado)
//POST /api/auth/recover
router.post('/recover', authController.recoverPassword);

module.exports = router;