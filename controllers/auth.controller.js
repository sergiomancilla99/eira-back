import jwt from 'jsonwebtoken'
import * as UsuariosServices from '../services/auth.service.js'
import * as MailServices from '../services/mail.service.js'

function crear (req, res) {
    let usuario = null
    if(req.body.matricula) {
        usuario = {...req.body, verificado: false}
    } else {
        usuario = req.body
    }
    UsuariosServices.crear(usuario)
    .then(function (usuarioNuevo) {
        if(usuario.matricula) {
            MailServices.avisoValidarMatricula(usuario)
        }
        usuarioNuevo ?
        res.status(200).json({
            response: true,
            message: "Usuario creado"
        }) :
        res.status(500).json({mensaje: "No se pudo crear el usuario... intente de nuevo" })
    })
    .catch(function (err) {
        res.status(500).json({response: false, message: "Email ya existente.."})
    })
}

async function login (req, res) {
    return UsuariosServices.login(req.body)
    .then(usuario => {
        const token = jwt.sign(usuario, 'CLAVE_SECRETA_RED_SOCIAL')
        res.status(200).json({usuario,token})
    })
    .catch(err => res.status(500).json({mensaje: err.message}))
}

export {
    crear,
    login
}