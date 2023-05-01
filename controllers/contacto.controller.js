import * as MailServices from '../services/mail.service.js'

function contactoWeb(req, res) {
    MailServices.contactoWeb(req.body.email, req.body.nombre, req.body.mensaje)
    .then(response => {
        res.status(200).json("enviado")
    })
    .catch(err => res.status(500).json("Ocurrió un error al crear el pedido."))
}

export {
    contactoWeb
}