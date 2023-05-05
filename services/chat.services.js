import MongoDB from 'mongodb'
import { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })

const client = new MongoDB.MongoClient(process.env.DB_URL)

async function crear(usuarios) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const existe = await db.collection('chat').findOne({"usuarios": { $all: [new ObjectId(usuarios[0]), new ObjectId(usuarios[1])] }})
        if(!existe){
            await db.collection('chat').insertOne({"usuarios":usuarios})
        }
        return existe
    })
    .catch(err => console.log(err))
}

async function traerPorUsuarioId(id) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const chat = await db.collection('chat').find({"usuarios": { $in: [new ObjectId(id)] }}).toArray()
        return chat
    })
    .catch(err => console.log(err))
}

async function traerUno(usuarioId1, usuarioId2) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const chat = await db.collection('chat').findOne({"usuarios": { $all: [new ObjectId(usuarioId1), new ObjectId(usuarioId2)] }})
        return chat
    })
    .catch(err => console.log(err))
}

export {
    crear,
    traerPorUsuarioId,
    traerUno
}