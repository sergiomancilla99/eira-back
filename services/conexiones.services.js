import MongoDB from 'mongodb'
import { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })

const client = new MongoDB.MongoClient(process.env.DB_URL)

async function traerPorUsuario (id) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const pacientes = await db.collection('conexiones').findOne({"medico": ObjectId(id)}) // para profesionales
        if(!pacientes){
            return []
        } else {
            return pacientes
        }
    })
    .catch(err => console.log(err))
}

export {
    traerPorUsuario,
}