import * as ChatServices from '../services/chat.services.js'
import { ObjectId } from 'mongodb'

function crear (req, res) {
    const usuarios = [new ObjectId(req.body.emisor), new ObjectId(req.body.receptor)]
    ChatServices.crear(usuarios)
    .then((chatNuevo)=>{
        res.status(201).json(chatNuevo)
    })
}

function traerPorUsuarioId(req, res) {
    const usuarioId = req.params.usuarioId
    ChatServices.traerPorUsuarioId(usuarioId)
    .then(function(chat) {
        res.status(200).json(chat)
    })
}

function traerUno(req, res) {
    ChatServices.traerUno(req.params.usuarioId1, req.params.usuarioId2)
    .then(function(chat) {
        res.status(200).json(chat)
    })
}

export {
    crear,
    traerPorUsuarioId,
    traerUno
}