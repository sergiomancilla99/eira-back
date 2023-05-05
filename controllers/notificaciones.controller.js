import { DateTime } from 'luxon'
import * as NotificacionMail from '../services/mail.service.js'

function enviarNotificacionMail(req, res) {
    NotificacionMail.enviarNotificacionMail(req.body.email)
    .then((resp) => {
        resp ? res.status(200).json({response: true, message: "Se envió el correo"}) :
        res.status(404).json({
            response: false,
            message: "Hubo un error"
        })
    })
}

function enviarNotificacionFB(req, res) {
    const body = {
        "notification": {
            "title": "Recordatorio",
            "body": "Test push notification",
            "click_action": "https://eira.ar",
            "icon": "https://i.imgur.com/5zO5cce.png"
        },
        "to": `${req.body.tokenFB}`
    }
    const fecha = Date.now()
    const finalizacion = DateTime.fromObject({ year: 2022, month: 12, day: 7, hour: 18, minute: 34 }).toMillis()
    if(fecha <= finalizacion) {
    } else {
    }
}

export {
    enviarNotificacionMail,
    enviarNotificacionFB
}