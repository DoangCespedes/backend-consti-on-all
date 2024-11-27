
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

require('dotenv').config();

// Configurar transportador SMTP
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  },
  tls: {
    rejectUnauthorized: false // Deshabilita la validación de certificados no seguros
  }
});

// Función para enviar correos
const sendVerificationCode = async (email, code) => {
  try {
    const info = await transporter.sendMail({
      from: '"Mi App" <tu_correo@gmail.com>', // Remitente
      to: email, // Destinatario
      subject: 'Código de Verificación', // Asunto
      html: `<p>Tu código de verificación es: <strong>${code}</strong></p>`, // Contenido HTML
    });

    console.log('Correo enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return false;
  }
};

module.exports = { sendVerificationCode };
