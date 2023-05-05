import MongoDB, { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })

const client = new MongoDB.MongoClient(process.env.DB_URL)

async function traerPorUsuarioId (idUsuario) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const recordatorios = await db.collection('recordatorios').findOne({"idUsuario": new ObjectId(idUsuario) })
        return recordatorios
    })
    .catch(err => console.log(err))
}
export {
    traerPorUsuarioId
}