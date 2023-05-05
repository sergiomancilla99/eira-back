import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })

async function enviarNotificacionMail(email) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
      });

      let info = await transporter.sendMail({
        from: 'No olvides tomar tu medicamento <eiraappinformacion@gmail.com>',
        to: email,
        subject: "Recordatorio",
        html: "<b>No olvides tomar tu medicamento IBUPROFENO 300mg a las 20.00hs</b>",
      });

      return info
}

async function enviarToken(email, token) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: `${email}`,
      subject: "Recuperar Contraseña",
      html: `Este es tu link para recuperar la contraseña. Tené en cuenta que una vez que lo uses no podrás reutilizarlo. <br/>Hace <a href="https://eira.ar/recuperarContrasena/${token}/${email}">click aquí</a> para cambiar la contraseña`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function contrasenaRecuperada(email) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: `${email}`,
      subject: "Tu contraseña fue cambiada",
      html: `Tu contraseña fue cambiada exitosamente.<br/> Si vos no hiciste el cambio contactanos a eiraappinformacion@gmail.com`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function avisoValidarMatricula(medico) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
       pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: 'eiraappinformacion@gmail.com',
      subject: "Se registró un nuevo médico - Validar matrícula",
      html: `Se registró el médico <b>${medico.nombre} ${medico.apellido}</b> con número de matrícula: <b>${medico.matricula}</b>.<br>Validar matrícula para que el médico pueda hacer uso de la app.`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function avisoMedicoVerificacion(medico) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  let asunto = null;
  let texto = null;

  if(medico.verificado) {
    asunto = "Tu matrícula fue verificada"
    texto = `Hola ${medico.nombre} ${medico.apellido}, ya verificamos tu matrícula, y te dimos acceso a las funcionalidades de profesionales de salud.`
  } else {
    asunto = "Hubo un problema con la verificación de tu matrícula"
    texto = `Hola ${medico.nombre} ${medico.apellido}, tuvimos problemas para poder verificar tu matrícula. Por favor, ponete en contacto en nosotros para poder resolver el problema lo antes posbile.<br>
    Escirbinos un mail con el asunto "No se verificó mi matrícula" a <a href="mailto:eiraappinformacion@gmail.com" target="_blank">eiraappinformacion@gmail.com</a>`
  }

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: medico.email,
      subject: asunto,
      html: texto,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function pedidoReceta(email, paciente) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
       pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: `${email}`,
      subject: "Pedido de Receta",
      html: `El paciente <strong>${paciente}</strong> hizo un pedido de receta. Iniciá sesión y visitá la sección de recetas para poder ver el listado de pedidos.`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function envioReceta(email, nombre) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
       pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: `${email}`,
      subject: "Envío de Receta",
      html: `¡Hola ${nombre}! El médico cargó la receta que pediste. Iniciá sesión y visitá la sección de recetas para poder verla.`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function contactoWeb(email, nombre, mensaje) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
       pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: "eiraappinformacion@gmail.com",
      subject: "Contacto desde la web",
      html: `<strong>${nombre}</strong> se contactó desde la web.<br/>Email: <strong>${email}</strong><br/> Mensaje:<br/>${mensaje}`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

export {
    enviarNotificacionMail,
    enviarToken,
    contrasenaRecuperada,
    avisoValidarMatricula,
    avisoMedicoVerificacion,
    pedidoReceta,
    envioReceta,
    contactoWeb
}