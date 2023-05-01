import MongoDB, { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })
import { DateTime } from 'luxon'

const client = new MongoDB.MongoClient(process.env.DB_URL)

async function traerPorIdPaciente(id, idProfesional) {
    return client.connect()
        .then(async function () {
            const db = client.db('eira')
            const progresos = await db.collection('progresos').find({ "paciente._id": new ObjectId(id) }).toArray()
            return progresos
        })
    .catch(err => console.log(err))

}

async function traerPorIdPacienteYIdProfesional(id, idProfesional) {
    return client.connect()
        .then(async function () {
            const db = client.db('eira')
            const progresos = await db.collection('progresos').find({ "paciente._id": new ObjectId(id), "profesional._id": new ObjectId(idProfesional) }).toArray()
            return progresos
        })
        .catch(err => console.log(err))
}

async function confirmarActividad(paciente, profesional, actividad, idTratamiento, diagnostico) {
    return client.connect()
        .then(async function () {
            const db = client.db('eira')
            const progresos = await db.collection('progresos').findOneAndUpdate({ "paciente": paciente, "profesional": profesional, "idTratamiento": idTratamiento }, {
                $set: {
                    diagnostico: diagnostico
                },
                $push: { actividades: actividad }
            },
                { upsert: true, returnNewDocument: true })
            console.log(progresos)
            return progresos
            // areglar fecha de guardado
        })
        .catch(err => console.log(err))
}

async function negarActividad(paciente, profesional, actividad, idTratamiento, diagnostico) {
    return client.connect()
        .then(async function () {
            const db = client.db('eira')
            const progresos = await db.collection('progresos').findOneAndUpdate({ "paciente": paciente, "profesional": profesional, "idTratamiento": idTratamiento }, {
                $set: {
                    diagnostico: diagnostico
                },
                $push: { actividades: actividad }
            },
                { upsert: true, returnNewDocument: true })
            console.log(progresos)
            return progresos
            // areglar fecha de guardado
        })
        .catch(err => console.log(err))
}

async function editar(idProgreso, nuevaHora) {
    return client.connect()
        .then(async function () {
            const db = client.db('eira')
            const progreso = await db.collection('progresos').updateOne(
                {"_id": new ObjectId(idProgreso), "actividades.idActividad": new ObjectId(nuevaHora.idActividad)},
                {$set: {"actividades.$": nuevaHora}}
            )
            return progreso
        })
        .catch(err => console.log(err))
}

export {
    traerPorIdPaciente,
    confirmarActividad,
    traerPorIdPacienteYIdProfesional,
    editar,
    negarActividad

}