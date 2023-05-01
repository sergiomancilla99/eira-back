import * as ConexionesServices from '../services/conexiones.services.js'

function traerPorUsuario (req, res) {
    const id = req.params.idUsuario
    ConexionesServices.traerPorUsuario(id)
    .then(function (pacientes) {
        pacientes ?
        res.status(200).json(pacientes) :
        res.status(404).json({mensaje: "No hay pacientes vinculados..." })
    })
}

export {
    traerPorUsuario
}