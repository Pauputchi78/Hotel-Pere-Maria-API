// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendEmail} = require('../config/mailer.js');

/**
 * Login del usuario
 * POST /api/auth/login
 * Body: { email, password }
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password){
      return res.status(400).json({
        error: 'Email y contraseña son obligatorios'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user){
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const esCorrecta = await bcrypt.compare(password, user.password);

    if (!esCorrecta) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    //Validamos si el usuario esta activo
    if (!user.isActive){
      return res.status(403).json({
        error: 'Usuario desactivado'
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id,
        email: user.email,
        role: user.role,
        isVIP: user.isVIP
      },
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      mensaje: '¡Bienvenido!',
      token: token,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role,
        profileImage: user.profileImage,
        isVIP: user.isVIP,
        discount: user.discount,
        dni: user.dni,
        birthDate: user.birthDate,
        gender: user.gender,
        city: user.city,
        isActive: user.isActive
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Error en login', detalle: err.message });
  }
}

async function logout(req, res) {
  try {
    // Con JWT el servidor no mantiene una sesión activa.
    // El "logout" real consiste en que la aplicación cliente (Android/WPF)
    // elimine el token que tiene guardado.
    return res.status(200).json({ 
      message: 'Sesión cerrada correctamente. Recuerda eliminar el token en la aplicación cliente.' 
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al procesar el cierre de sesión', detalle: err.message });
  }
}

/**
 * Recuperar contraseña
 * POST /api/auth/recover
 * Body: { email }
 */
async function recoverPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio' });
    }

    //Buscamos al usuario por email
    const user = await User.findOne({ email }).select('+password');

    //Si no existe el usuario, respondemos igual para no revelar si el email esta registrado
    if (!user) {
      return res.status(200).json({
        message: 'Si el email existe, recibirás una contraseña temporal en tu correo'
      });
    }

    //Generamos una contraseña temporal de 8 caracteres
    //Nos aseguramos de que tenga al menos 1 mayuscula, 1 minuscula y 1 numero
    const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const minusculas = 'abcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const todos = mayusculas + minusculas + numeros;

    //Empezamos con 1 de cada tipo para cumplir la validacion de contraseña
    let tempPassword = '';
    tempPassword += mayusculas.charAt(Math.floor(Math.random() * mayusculas.length));
    tempPassword += minusculas.charAt(Math.floor(Math.random() * minusculas.length));
    tempPassword += numeros.charAt(Math.floor(Math.random() * numeros.length));

    //Rellenamos hasta 8 caracteres con caracteres aleatorios
    for (let i = 3; i < 8; i++) {
      tempPassword += todos.charAt(Math.floor(Math.random() * todos.length));
    }

    //Mezclamos los caracteres para que no siempre empiece igual
    tempPassword = tempPassword.split('').sort(() => Math.random() - 0.5).join('');

    //Hasheamos la contraseña temporal y la guardamos en la BD
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    //Enviamos el correo con la contraseña temporal
    const asunto = 'Recuperación de contraseña - Hotel Pere Maria';
    const mensajeHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1>Hola ${user.name}!</h1>
        <p>Has solicitado recuperar tu contraseña.</p>
        <p>Tu contraseña temporal es:</p>
        <h2 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 2px;">${tempPassword}</h2>
        <p>Usa esta contraseña para iniciar sesión y cámbiala desde tu perfil lo antes posible.</p>
        <br>
        <p>Atentamente,<br>El equipo del Hotel Pere María</p>
      </div>
    `;

    await sendEmail(email, asunto, mensajeHtml);

    return res.status(200).json({
      message: 'Si el email existe, recibirás una contraseña temporal en tu correo'
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al recuperar contraseña', detalle: err.message });
  }
}

module.exports = { login, logout, recoverPassword};