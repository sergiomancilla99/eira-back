import * as RecordatorioService from '../services/recordatiorios.service.js'

function traerPorUsuarioId (req, res) {
    RecordatorioService.traerPorUsuarioId(req.params.idUsuario)
    .then(function (recordatorios) {
        recordatorios ?
        res.status(200).json(recordatorios) :
        res.status(404).json({mensaje: "No hay recordatorios.." })
    })
}

export {
    traerPorUsuarioId
}