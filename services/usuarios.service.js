import MongoDB from 'mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'

const client = new MongoDB.MongoClient('mongodb://127.0.0.1:27017')

async function olvideContrasena (email, token) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        let usuarioEditado = null
        const usuarioPaciente = await db.collection('pacientes').findOne({"email": email})
        const usuarioMedico = await db.collection('medicos').findOne({"email": email})
        if(usuarioPaciente) {
            usuarioEditado = await db.collection('pacientes').updateOne({"email": email}, {$set: {token_contrasena: token}})
        } else if(usuarioMedico) {
            usuarioEditado = await db.collection('medicos').updateOne({"email": email}, {$set: {token_contrasena: token}})
        }
        return usuarioEditado
    })
    .catch(err => console.log(err))
}

async function recuperarContrasena(email, token, password) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const usuarioPaciente = await db.collection('pacientes').findOne({"email": email, "token_contrasena": token})
        const usuarioMedico = await db.collection('medicos').findOne({"email": email, "token_contrasena": token})
        if(usuarioPaciente || usuarioMedico) {
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)
            let usuarioEditado = null
            if(usuarioPaciente) {
                usuarioEditado = await db.collection('pacientes').updateOne({"email": email, "token_contrasena": token}, {$set: {password: passwordHash, token_contrasena: null}})
            } else if(usuarioMedico) {
                usuarioEditado = await db.collection('medicos').updateOne({"email": email, "token_contrasena": token}, {$set: {password: passwordHash, token_contrasena: null}})
            }
            return usuarioEditado
        } else {
            return false
        }
    })
    .catch(err => console.log(err))
}

async function traerProfesionalesVinculados(idUsuario) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const profesionalesVinculados = await db.collection('conexiones').find({"pacientes._id": new ObjectId(idUsuario)}).toArray()
        return profesionalesVinculados
    })
    .catch(err => console.log(err))
}

async function agregarProfesional(idProfesional, paciente) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const existe = await db.collection('solicitudes').findOne({"emisor._id": new ObjectId(paciente._id), "receptor": new ObjectId(idProfesional)})
        if(!existe) {
            const solicitud = await db.collection('solicitudes').insertOne({emisor: paciente, receptor: new ObjectId(idProfesional), aceptado: false})
            return solicitud
        } else {
            return existe
        }
    })
    .catch(err => console.log(err))
}

async function cambiarContrasena(id, tipo, password) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)
        let usuarioEditado = null
        if(tipo == 'paciente') {
            usuarioEditado = await db.collection('pacientes').updateOne({"_id": ObjectId(id)}, {$set: {password: passwordHash}})
        } else if(tipo == 'medico') {
            usuarioEditado = await db.collection('medicos').updateOne({"_id": ObjectId(id)}, {$set: {"password": passwordHash}})
        }
        return usuarioEditado
    })
    .catch(err => console.log(err))
}

export {
    olvideContrasena,
    recuperarContrasena,
    traerProfesionalesVinculados,
    agregarProfesional,
    cambiarContrasena
}