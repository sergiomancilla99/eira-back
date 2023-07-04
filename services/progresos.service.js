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

async function confirmarActividadNotifcacion () {
    return client.connect()
        .then(async function () {
            const db = client.db('eira')
            const existeRecordatorio = await db.collection('recordatorios').findOne({ 'idUsuario': new ObjectId(paciente._id), 'idTratamiento': new ObjectId(idTratamiento) })

            
        })
}

async function confirmarActividad(paciente, profesional, frecuenciaHoraria, actividad, idTratamiento, diagnostico) {
    return client.connect()
        .then(async function () {
            const db = client.db('eira')
            const existeRecordatorio = await db.collection('recordatorios').findOne({ 'idUsuario': new ObjectId(paciente._id), 'idTratamiento': new ObjectId(idTratamiento) })
            if (!existeRecordatorio) {
                console.log('creo el recordatorio con los horarios y confirmo')
                const horaActual = DateTime.local()
                const cantidad = 24 / frecuenciaHoraria
                const recordatorios = {}
                for (let i = 0; i < cantidad; i++) {
                    // agarra la hora actual y le suma las horas segun la frecuencia. Luxon
                    const horaSiguiente = horaActual.plus({ hours: i * frecuenciaHoraria })
                    const horaTexto = horaSiguiente.toFormat("HH:mm")
                    recordatorios[horaTexto] = [{ nombre: actividad.nombre }]
                    console.log("tomo a las: ", horaTexto)
                }
                // creo las horas que debe tomar
                await db.collection('recordatorios').insertOne(
                    {
                        idUsuario: paciente._id,
                        idTratamiento: idTratamiento,
                        idProfesional: profesional._id,
                        recordatorios
                    })

                // guardo en progreso a que hora tomó
                await db.collection('progresos').findOneAndUpdate({ "paciente": paciente, "profesional": profesional, "idTratamiento": idTratamiento }, {
                    $set: {
                        diagnostico: diagnostico
                    },
                    $push: { actividades: actividad }
                },
                    { upsert: true, returnNewDocument: true })
                return existeRecordatorio
            } else {
                // ya existe documento, entocnes agrego recordatorio. Si ya existe el recordatorio, no hacer nada, de lo contrario agregarlo
                const existeMedicamento = Object.values(existeRecordatorio.recordatorios).some(medicamentos => {
                    return medicamentos.some(medicamento => medicamento.nombre === actividad.nombre)
                });
                // console.log("Ya existe su recordatorio, no hacer nada, solo confirmar para progreso", existeMedicamento)

                if (!existeMedicamento) {
                    const recordatorios = { ...existeRecordatorio.recordatorios }
                    const horaActual = DateTime.local()
                    const cantidad = 24 / frecuenciaHoraria
                    const horasNuevosRecordatorios = []
                    for (let i = 0; i < cantidad; i++) {
                        const hora = horaActual.plus({ hours: i * frecuenciaHoraria })
                        const horaTexto = hora.toFormat('HH:mm')
                        horasNuevosRecordatorios.push(horaTexto)
                    }

                    // const existe = recordatorios[hora].find( nombre =>  nombre.nombre === actividad.nombre)
                    horasNuevosRecordatorios.forEach(async hora => {
                        if (recordatorios[hora]) {
                            for (let i = 0; i < recordatorios[hora].length; i++) {
                                const existe = recordatorios[hora].find(nombre => nombre.nombre === actividad.nombre)
                                if (!existe) {
                                    recordatorios[hora].push({ nombre: actividad.nombre })
                                }
                            }
                        } else {
                            console.log("no existe hora, creo con su nombre")
                            recordatorios[hora] = [{ nombre: actividad.nombre }];
                        }
                    })

                    await db.collection('recordatorios').updateOne(
                        { 'idUsuario': new ObjectId(paciente._id), 'idTratamiento': new ObjectId(idTratamiento) },
                        {
                            $set: { recordatorios: recordatorios }
                        })
                }

                const progresos = await db.collection('progresos').findOneAndUpdate({ "paciente": paciente, "profesional": profesional, "idTratamiento": idTratamiento }, {
                    $push: { actividades: actividad }
                },
                    { upsert: true, returnNewDocument: true })
                //console.log(progresos)
                return progresos
            }

        
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
                { "_id": new ObjectId(idProgreso), "actividades.idActividad": new ObjectId(nuevaHora.idActividad) },
                { $set: { "actividades.$": nuevaHora } }
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