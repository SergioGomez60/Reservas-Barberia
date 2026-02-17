const nodemailer = require('nodemailer');

// Configuración del transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s/g, '') // Eliminar espacios de la contraseña
  }
});

// Función para enviar correo de confirmación de cita
async function sendAppointmentConfirmation(appointment) {
  const { client, email, date, time, barberId, serviceId, phone } = appointment;

  // Obtener datos del barber y servicio si están populados
  const barberName = barberId?.name || 'El barbero seleccionado';
  const serviceName = serviceId?.name || 'El servicio seleccionado';
  const servicePrice = serviceId?.price || 0;
  const serviceDuration = serviceId?.duration || 0;

  // Formatear fecha
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmación de tu cita en Barbería',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0d0d0d; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0d0d0d; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 500px; background-color: #1a1a1a; border-radius: 16px; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #0d0d0d; font-size: 24px; font-weight: 700;">Barbería</h1>
                    <p style="margin: 5px 0 0 0; color: #0d0d0d; font-size: 14px;">Confirmación de Cita</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 20px; text-align: center;">¡Hola, ${client}!</h2>
                    <p style="margin: 0 0 25px 0; color: #888888; font-size: 14px; text-align: center;">Tu cita ha sido confirmada correctamente. Aquí están los detalles:</p>

                    <!-- Appointment Details -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #252525; border-radius: 12px; margin-bottom: 25px;">
                      <tr>
                        <td style="padding: 20px;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 15px;">
                                <span style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Fecha</span>
                                <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">${formattedDate}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 15px;">
                                <span style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Hora</span>
                                <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">${time}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 15px;">
                                <span style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Servicio</span>
                                <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">${serviceName}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 15px;">
                                <span style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Barbero</span>
                                <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">${barberName}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 15px;">
                                <span style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Precio</span>
                                <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">$${servicePrice}</p>
                              </td>
                            </tr>
                            ${phone ? `
                            <tr>
                              <td>
                                <span style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Teléfono</span>
                                <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">${phone}</p>
                              </td>
                            </tr>
                            ` : ''}
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Message -->
                    <p style="margin: 0 0 20px 0; color: #888888; font-size: 14px; text-align: center;">Por favor, llega 10 minutos antes de tu cita. Si necesitas cancelar o reprogramar, contáctanos con al menos 24 horas de anticipación.</p>

                    <!-- Footer -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="text-align: center; padding-top: 20px; border-top: 1px solid #333333;">
                          <p style="margin: 0; color: #666666; font-size: 12px;">Gracias por confiar en nosotros</p>
                          <p style="margin: 5px 0 0 0; color: #d4af37; font-size: 14px; font-weight: 600;">Barbería</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de confirmación enviado a: ${email}`);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
}

module.exports = { sendAppointmentConfirmation };
