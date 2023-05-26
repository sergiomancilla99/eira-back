import MongoDB, { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })

const client = new MongoDB.MongoClient(process.env.DB_URL)

async function traerPorUsuarioId (idUsuario) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const recordatorios = await db.collection('recordatorios').find({"idUsuario": new ObjectId(idUsuario) }).toArray()
        const recordatoriosMap = recordatorios.map(recordatorio => {
            return {recordatorios: recordatorio.recordatorios, idTratamiento: recordatorio.idTratamiento}
        })
       // console.log(recordatoriosMap)
        return recordatoriosMap
    })
    .catch(err => console.log(err))
}

export {
    traerPorUsuarioId
}