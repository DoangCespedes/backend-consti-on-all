const { Resend } = require("resend");
require('dotenv').config();

// Configurar Resend
const resend = new Resend(process.env.RESEND_API_KEY); // Clave API almacenada en variables de entorno

// Función para enviar correos
const sendVerificationCode = async (email, code) => {
  try {
    const { data, error } = await resend.emails.send({
      from: '"Mi App" <onboarding@resend.dev>', // Remitente
      to: [email], // Destinatario
      subject: 'Código de Verificación', // Asunto
      html: `<p>Tu código de verificación es: <strong>${code}</strong></p>`, // Contenido HTML
    });

    if (error) {
      console.error('Error al enviar el correo:', error);
      return false;
    }

    console.log('Correo enviado:', data.id); // Muestra el ID del mensaje enviado
    return true;
  } catch (err) {
    console.error('Error al enviar el correo:', err.message);
    return false;
  }
};

module.exports = { sendVerificationCode };
