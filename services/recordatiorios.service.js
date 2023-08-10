import MongoDB, { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })

const client = new MongoDB.MongoClient(process.env.DB_URL)

async function traerPorUsuarioId(idUsuario) {
    return client.connect()
        .then(async function () {
            const db = client.db('eira')
            const recordatorios = await db.collection('recordatorios').find({ "idUsuario": new ObjectId(idUsuario) }).toArray()
            const recordatoriosMap = recordatorios.map(recordatorio => {
                return { recordatorios: recordatorio.recordatorios, idTratamiento: recordatorio.idTratamiento }
            })
            // console.log(recordatoriosMap)
            return recordatoriosMap
        })
        .catch(err => console.log(err))
}

async function traerHistorialPorIdUsuario(idUsuario) {
    return client.connect()
        .then(async function () {
            const db = client.db('eira')
            const historial = await db.collection('historial-notificaciones').findOne({ "idUsuario": new ObjectId(idUsuario) })

            return historial
        })
        .catch(err => console.log(err))
}

async function crearHistorial(idUsuario, nombreMedicamento, notificacion) {
    // console.log(idUsuario, notificacion)
    return client.connect()
        .then(async function () {
            const db = client.db('eira')

            // const historial = await db.collection('historial-notificaciones').updateOne({"idUsuario": new ObjectId(idUsuario), notificaciones: [{
            //     link: notificacion,
            //     fecha: new Date(Date.now()),
            //     clicked: false
            // }] })
            const historial = await db.collection('historial-notificaciones').updateOne({ "idUsuario": new ObjectId(idUsuario) },
                {
                    $addToSet: {
                        "notificaciones": {
                            $each: [{
                                idHistorial: new ObjectId(),
                                nombre: nombreMedicamento,
                                link: notificacion,
                                fecha: new Date(Date.now()),
                                clicked: false
                            }]
                        }
                    }
                },
                { upsert: true })
            return historial
        })
        .catch(err => console.log(err))
}

async function editarHistorial(idUsuario, notificacion) {
    // console.log(idUsuario, notificacion)
    return client.connect()
        .then(async function () {
            const db = client.db('eira')

            // const historial = await db.collection('historial-notificaciones').updateOne({"idUsuario": new ObjectId(idUsuario), notificaciones: [{
            //     link: notificacion,
            //     fecha: new Date(Date.now()),
            //     clicked: false
            // }] }) 
            
            const historial = await db.collection('historial-notificaciones').updateOne( 
                { "idUsuario": new ObjectId(idUsuario), "notificaciones.idHistorial": new ObjectId(notificacion.idHistorial) },
                { $set: { "notificaciones.$": notificacion } },
                { upsert: true })
            return historial
        })
        .catch(err => console.log(err))
}

export {
    traerPorUsuarioId,
    traerHistorialPorIdUsuario,
    crearHistorial,
    editarHistorial
}