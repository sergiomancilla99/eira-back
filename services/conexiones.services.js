import MongoDB from 'mongodb'
import { ObjectId } from 'mongodb'

const client = new MongoDB.MongoClient('mongodb://127.0.0.1:27017')

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