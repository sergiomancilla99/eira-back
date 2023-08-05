import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

//const hbs = require('nodemailer-express-handlebars');

function crearTransporter() {
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

  return transporter;
}

function configurarTranporter(transporter) {
  transporter.use('compile', hbs({
    viewEngine: {
      extname: '.handlebars',
      partialsDir: path.resolve('./../eira-back/templates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./../eira-back/templates'),
    extName: '.handlebars'
  }))
}

async function enviarNotificacionMail(email) {
  let transporter = crearTransporter();

  configurarTranporter(transporter);

    let info = await transporter.sendMail({
      from: 'Eira <eiraappinformacion@gmail.com>',
      to: email,
      subject: "PRUEBA",
      /*html: "<b>No olvides tomar tu medicamento IBUPROFENO 300mg a las 20.00hs</b>",*/
      template: "prueba",
      context: {
        email: email
      }
    });

    return info
}

async function enviarToken(email, token) {
  let transporter = crearTransporter();

  configurarTranporter(transporter);

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: `${email}`,
      subject: "Recuperar Contraseña",
      template: "recuperar",
      context: {
        email: email,
        token: token
      },
      // html: `Este es tu link para recuperar la contraseña. Tené en cuenta que una vez que lo uses no podrás reutilizarlo. <br/>Hace <a href="https://eira.ar/recuperarContrasena/${token}/${email}">click aquí</a> para cambiar la contraseña`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function contrasenaRecuperada(email) {
  let transporter = crearTransporter();

  configurarTranporter(transporter);

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: `${email}`,
      subject: "Tu contraseña fue cambiada",
      // html: `Tu contraseña fue cambiada exitosamente.<br/> Si vos no hiciste el cambio contactanos a eiraappinformacion@gmail.com`,
      template: "recuperado",
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function avisoValidarMatricula(medico) {
  let transporter = crearTransporter();

  configurarTranporter(transporter);

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: 'eiraappinformacion@gmail.com',
      subject: "Se registró un nuevo médico - Validar matrícula",
      // html: `Se registró el médico <b>${medico.nombre} ${medico.apellido}</b> con número de matrícula: <b>${medico.matricula}</b>.<br>Validar matrícula para que el médico pueda hacer uso de la app.`,
      template: "nuevomedico",
      context: {
        nombre: medico.nombre,
        apellido: medico.apellido,
        matricula: medico.matricula,
      },
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function avisoMedicoVerificacion(medico) {
  let transporter = crearTransporter();

  configurarTranporter(transporter);

  let asunto = null;
  // let texto = null;
  let template = null;

  if(medico.verificado) {
    asunto = "Tu matrícula fue verificada"
    // texto = `Hola ${medico.nombre} ${medico.apellido}, ya verificamos tu matrícula, y te dimos acceso a las funcionalidades de profesionales de salud.`
    template = "verificado"
  } else {
    asunto = "Hubo un problema con la verificación de tu matrícula"
    // texto = `Hola ${medico.nombre} ${medico.apellido}, tuvimos problemas para poder verificar tu matrícula. Por favor, ponete en contacto en nosotros para poder resolver el problema lo antes posbile.<br>
    // Escirbinos un mail con el asunto "No se verificó mi matrícula" a <a href="mailto:eiraappinformacion@gmail.com" target="_blank">eiraappinformacion@gmail.com</a>`
    template = "noverificado"
  }

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: medico.email,
      subject: asunto,
      // html: texto,
      template: template,
      context: {
        nombre: medico.nombre,
        apellido: medico.apellido,
      },
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function pedidoReceta(email, paciente) {
  let transporter = crearTransporter();

  configurarTranporter(transporter);

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: `${email}`,
      subject: "Pedido de Receta",
      // html: `El paciente <strong>${paciente}</strong> hizo un pedido de receta. Iniciá sesión y visitá la sección de recetas para poder ver el listado de pedidos.`,
      template: "pedidoreceta",
      context: {
        paciente: paciente,
      },
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function envioReceta(email, nombre) {
  let transporter = crearTransporter();

  configurarTranporter(transporter);

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: `${email}`,
      subject: "Envío de Receta",
      // html: `¡Hola ${nombre}! El médico cargó la receta que pediste. Iniciá sesión y visitá la sección de recetas para poder verla.`,
      template: "envioreceta",
      context: {
        nombre: nombre,
      },
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function contactoWeb(email, nombre, mensaje) {
  let transporter = crearTransporter();

  configurarTranporter(transporter);

  let info = await transporter.sendMail({
      from: '"Eira" <eiraappinformacion@gmail.com>',
      to: "eiraappinformacion@gmail.com",
      subject: "Contacto desde la web",
      // html: `<strong>${nombre}</strong> se contactó desde la web.<br/>Email: <strong>${email}</strong><br/> Mensaje:<br/>${mensaje}`,
      template: "contacto",
      context: {
        nombre: nombre,
        email: email,
        mensaje: mensaje,
      },
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