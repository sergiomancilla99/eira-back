import * as MensajesService from '../services/mensajes.services.js'
import { ObjectId } from 'mongodb'

function enviar(req, res) {
    const mensaje = {
        chat: new ObjectId(req.body.chat),
        emisor: new ObjectId(req.body.emisor),
        mensaje: req.body.mensaje,
        created_at: new Date(Date.now())
    }

    MensajesService.enviar(mensaje)
    .then(function(mensaje) {
        res.status(201).json(mensaje)
    })
}

function traer(req, res) {
    MensajesService.traer(req.params.chatId)
    .then(function(mensajes) {
        res.status(200).json(mensajes)
    })
}

export {
    enviar,
    traer
}