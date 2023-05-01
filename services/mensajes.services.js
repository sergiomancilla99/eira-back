import MongoDB from 'mongodb'
import { ObjectId } from 'mongodb'

const client = new MongoDB.MongoClient('mongodb://127.0.0.1:27017')

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