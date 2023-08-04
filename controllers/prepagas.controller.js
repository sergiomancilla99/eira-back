import * as PrepagasService from "../services/prepagas.service.js"

function traerTodos (req ,res) {
    PrepagasService.traerTodos()
    .then(function (lista) {
        lista ?
        res.status(200).json(lista) :
        res.status(404).json({mensaje: "No hay nombres..." })
    })
}

export {
    traerTodos
}