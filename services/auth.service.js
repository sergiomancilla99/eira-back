import MongoDB from 'mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })

const client = new MongoDB.MongoClient(process.env.DB_URL)

async function crear (usuario) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        if(!usuario.matricula) {
            const usuarioPacienteExiste = await db.collection('pacientes').findOne({"email": usuario.email})
            if(!usuarioPacienteExiste) {
                const salt = await bcrypt.genSalt(10)
                const passwordHash = await bcrypt.hash(usuario.password, salt)
                const usuarioNuevo = await db.collection('pacientes').insertOne({...usuario, password: passwordHash})
                return usuarioNuevo
            } else {
                throw new Error('Email ya existente...')
            }
        } else {
            const usuarioProfesionalExiste = await db.collection('medicos').findOne({"email": usuario.email})
            if(!usuarioProfesionalExiste) {
                const salt = await bcrypt.genSalt(10)
                const passwordHash = await bcrypt.hash(usuario.password, salt)
                const usuarioNuevo = await db.collection('medicos').insertOne({...usuario, password: passwordHash})
                await db.collection('conexiones').insertOne({"medico": new ObjectId(usuarioNuevo.insertedId), "pacientes": []})
                await db.collection('recetas').insertOne({"medico": new ObjectId(usuarioNuevo.insertedId), "recetas": []})
                return usuarioNuevo
            } else {
                throw new Error('Email ya existente...')
            }
        }
    })
}

async function login({email, password}) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const usuario = await db.collection('pacientes').findOne({ email }) || await db.collection('medicos').findOne({ email })
        if(usuario) {
            const passwordValida = await bcrypt.compare(password, usuario.password)
            if(passwordValida) {
                return { ...usuario, password: undefined }
            }
        }
    })
}

export {
    crear,
    login
}