const express = require('express');
const { sendVerificationCode } = require('../helpers/emailService');

const router = express.Router();

// Ruta para enviar código de verificación
router.post('/send-code', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El email es obligatorio.' });
  }

  const code = Math.floor(100000 + Math.random() * 900000); // Genera un código de 6 dígitos

  const emailSent = await sendVerificationCode(email, code);
  if (emailSent) {
    res.status(200).json({ message: 'Código enviado correctamente.', code });
  } else {
    res.status(500).json({ error: 'Error al enviar el código.' });
  }
});

module.exports = router;
