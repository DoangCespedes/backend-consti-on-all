const express = require('express');
const { sendVerificationCode } = require('../helpers/emailService');
const validator = require('validator'); // Para validar el formato del email

const router = express.Router();

// Ruta para enviar código de verificación
router.post('/send-code', async (req, res) => {
  const { email } = req.body;

  // Validación básica del formato del email
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'El email es obligatorio y debe ser válido.' });
  }

  const code = Math.floor(100000 + Math.random() * 900000); // Genera un código de 6 dígitos

  try {
    const emailSent = await sendVerificationCode(email, code);
    if (emailSent) {
      return res.status(200).json({ message: 'Código enviado correctamente.', code });
    } else {
      return res.status(500).json({ error: 'No se pudo enviar el código. Por favor, intente nuevamente.' });
    }
  } catch (err) {
    console.error('Error en el proceso de envío de correo:', err.message);
    return res.status(500).json({ error: 'Error al enviar el código, por favor intente más tarde.' });
  }
});

module.exports = router;
