import MongoDB from 'mongodb'
import { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })

const client = new MongoDB.MongoClient(process.env.DB_URL)

async function enviar(mensaje) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const mensajeEnviado = await db.collection('mensajes').insertOne(mensaje)
        return mensajeEnviado
    })
    .catch(err => console.log(err))
}

async function traer(chatId) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const mensajes = await db.collection('mensajes').find({"chat": new ObjectId(chatId)}).toArray()
        return mensajes
    })
    .catch(err => console.log(err))
}

export {
    enviar,
    traer
}