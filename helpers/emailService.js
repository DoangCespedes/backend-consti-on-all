const { Resend } = require("resend");
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Función para enviar correos
const sendVerificationCode = async (email, code) => {
  console.log('Clave API:', process.env.RESEND_API_KEY); // Asegúrate de que la clave esté correcta

  try {
    const { data, error } = await resend.emails.send({
      from: '"Consti-on-all" <noreply@collisioncenterpdr.com>',
      to: [email],
      subject: 'Código de Verificación',
      html: `<p>Tu código de verificación es: <strong>${code}</strong></p>`,
    });

    if (error) {
      console.error('Error al enviar el correo:', error); // Imprimir el error completo
      return false;
    }

    console.log('Correo enviado:', data.id); // Muestra el ID del mensaje enviado
    return true;
  } catch (err) {
    console.error('Error al enviar el correo:', err); // Imprimir error completo
    return false;
  }
};

module.exports = { sendVerificationCode };