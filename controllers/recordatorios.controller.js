import * as RecordatorioService from '../services/recordatiorios.service.js'
import { ObjectId } from 'mongodb'

function traerPorUsuarioId(req, res) {
    RecordatorioService.traerPorUsuarioId(req.params.idUsuario)
        .then(function (recordatorios) {
            recordatorios ?
                res.status(200).json(recordatorios) :
                res.status(404).json({ mensaje: "No hay recordatorios.." })
        })
}

function traerHistorialPorIdUsuario(req, res) {
    RecordatorioService.traerHistorialPorIdUsuario(req.params.idUsuario)
        .then(function (historial) {
            historial ?
                res.status(200).json({ historial, ok: true}) :
                res.status(404).json({ mensaje: "No hay historial de notificaciones..", ok: false })
        })
}

function editar(req, res) {
    const notificacion = {
        ...req.body.notificacion,
        idHistorial: new ObjectId(req.body.notificacion.idHistorial),
        fecha: new Date(req.body.notificacion.fecha),
        clicked: true
    }
    // console.log("ACAAA", notificacion)
    RecordatorioService.editarHistorial(req.body.idUsuario, notificacion)
        .then(function (editado) {
            editado ?
                res.status(200).json(editado) :
                res.status(404).json({ mensaje: "No hay historial para editar.." })
        })
}

export {
    traerPorUsuarioId,
    traerHistorialPorIdUsuario,
    editar
}