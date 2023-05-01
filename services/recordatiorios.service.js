import MongoDB, { ObjectId } from 'mongodb'

const client = new MongoDB.MongoClient('mongodb://127.0.0.1:27017')

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