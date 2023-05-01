import * as UsuariosServices from '../services/usuarios.service.js'
import { ObjectId } from 'mongodb'
import * as MailServices from '../services/mail.service.js'

function olvideContrasena (req ,res) {
    const email = req.body.email
    const token = Math.random().toString(16).substring(2, 16);
    UsuariosServices.olvideContrasena(email, token)
    .then((usuarioEditado) => {
        if(usuarioEditado.modifiedCount !== 0 ) {
            MailServices.enviarToken(email, token)
            res.status(200).json({response: true, message: "Se envió el mail", usuarioEditado})
        } else {
            res.status(404).json({
                response: false,
                message: "El email ingresado no existe"
            })
        }
    })
    .catch(err => {
        res.status(500).json({message: "Ocurrió un error al crear el token", err})
    })
}

function recuperarContrasena(req, res) {
    const token = req.params.token
    const email = req.params.email
    const password = req.body.password
    UsuariosServices.recuperarContrasena(email, token, password)
    .then((usuarioEditado) => {
        if(usuarioEditado !== false) {
            MailServices.contrasenaRecuperada(email)
            res.status(200).send({response: true, message: "Se recuperó la contraseña", usuarioEditado})
        } else {
            res.status(500).send({response: false, message: "Este link ya fue usado para recuperar la contraseña"})
        }
    })
    .catch(err => {
        res.status(500).send({message: "Ocurrió un error al recuperar la contraseña", err})
    })
}

function traerProfesionalesVinculados(req, res) {
    UsuariosServices.traerProfesionalesVinculados(req.params.idUsuario)
    .then((profesionalesVinculados) => {
        if(profesionalesVinculados) {
            res.status(200).send(profesionalesVinculados)
        } else {
            res.status(204).send({response: false, message: "No tiene ningún profesional vinculado"})
        }
    })
    .catch(err => {
        res.status(500).send({message: "Ocurrió un error...", err})
    })
}

function agregarProfesional(req, res) {
    const paciente = {
        ...req.body.paciente,
        _id: new ObjectId(req.body.paciente._id)
    }

    UsuariosServices.agregarProfesional(req.body.idProfesional, paciente)
    .then((agregado) => {
        if(agregado) {
            res.status(200).send(agregado)
        } else {
            res.status(204).send({response: false, message: "No se pudo agregar al proofesional..."})
        }
    })
    .catch(err => {
        res.status(500).send({message: "Ocurrió un error...", err})
    })
}

function cambiarContrasena(req, res) {
    const id = req.params.id
    const password = req.body.password
    const tipo = req.body.tipo
    const email = req.body.email
    UsuariosServices.cambiarContrasena(id, tipo, password)
    .then((usuarioEditado) => {
        if(usuarioEditado.acknowledged && usuarioEditado.modifiedCount > 0) {
            MailServices.contrasenaRecuperada(email)
            res.status(200).send({response: true, message: "Se cambió la contraseña", usuarioEditado})
        } else {
            res.status(204).send({response: false, message: "ocurrió en error al intentar cambiar la contraseña"})
        }
    })
    .catch(err => {
        res.status(500).send({message: "Ocurrió un error al cambiar la contraseña", err})
    })
}

export {
    olvideContrasena,
    recuperarContrasena,
    traerProfesionalesVinculados,
    agregarProfesional,
    cambiarContrasena
}