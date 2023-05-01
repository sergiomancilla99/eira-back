import MongoDB from 'mongodb'
import { ObjectId } from 'mongodb'

const client = new MongoDB.MongoClient('mongodb://127.0.0.1:27017')

async function traerTodos() {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const tratamientos = await db.collection('tratamientos').find().toArray()
        return tratamientos
    })
    .catch(err => console.log(err))
}

async function crear(tratamiento) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const tratamientoNuevo = await db.collection('tratamientos').insertOne(tratamiento)
        return tratamientoNuevo
    })
    .catch(err => console.log(err))
}

async function traerPorIdPaciente(idPaciente) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const tratamientos = await db.collection('tratamientos').find({"id_paciente": new ObjectId(idPaciente)}).toArray()
        return tratamientos
    })
    .catch(err => console.log(err))
}

async function traerPorIdProfesional(idPaciente, idProfesional) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const tratamientos = await db.collection('tratamientos').find(
            {"id_paciente": new ObjectId(idPaciente),
            "profesional.id_medico": new ObjectId(idProfesional)}).toArray()
        return tratamientos
    })
    .catch(err => console.log(err))
}

async function traerPorId(id) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const tratamiento = await db.collection('tratamientos').findOne({"_id": ObjectId(id)})
        return tratamiento
    })
    .catch(err => console.log(err))
}

async function eliminar (id) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const tratameintoEliminado = await db.collection('tratamientos').deleteOne({"_id": ObjectId(id)})
        return tratameintoEliminado
    })
    .catch(err => console.log(err))
}

async function editarMedicamento (id, idObj, tratamiento, tipo) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        if(tipo === "medicamentos") {
            const tratamientoActualizado = await db.collection('tratamientos').updateOne(
                { "_id": new ObjectId(id), "tratamiento.medicamentos.id": idObj },
                { $set: {"tratamiento.medicamentos.$": tratamiento }}
            )
            return tratamientoActualizado
        } else if ( tipo === "ejercicios" ) {
            const tratamientoActualizado = await db.collection('tratamientos').updateOne(
                { "_id": new ObjectId(id), "tratamiento.ejercicios.id": idObj },
                { $set: {"tratamiento.ejercicios.$": tratamiento }}
            )
            return tratamientoActualizado
        }
    })
    .catch(err => console.log(err))
}

async function editarComida (id, comidaAntigua, comidaNueva) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const comidaActualizada = await db.collection("tratamientos").updateOne(
            { "_id": new ObjectId(id), "tratamiento.comidas": comidaAntigua},
            { $set: {"tratamiento.comidas.$": comidaNueva} }
        )
        return comidaActualizada
    })
    .catch(err => console.log(err))
}

async function eliminarComida(id, comida) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const eliminado = await db.collection("tratamientos").updateOne({ "_id": new ObjectId(id), "tratamiento.comidas": comida }, { $pull: {"tratamiento.comidas": {$in: [comida]}} })
        return eliminado
    })
    .catch(err => console.log(err))
}

async function eliminarMedicamento(id, idObj, tipo) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        if(tipo === "medicamentos") {
            const tratamientoActualizado = await db.collection('tratamientos').updateOne(
                { "_id": new ObjectId(id), "tratamiento.medicamentos.id": idObj },
                { $pull: {"tratamiento.medicamentos": {"id": idObj} } }
            )
            return tratamientoActualizado
        } else if ( tipo === "ejercicios" ) {
            const tratamientoActualizado = await db.collection('tratamientos').updateOne(
                { "_id": new ObjectId(id), "tratamiento.ejercicios.id": idObj },
                { $pull: {"tratamiento.ejercicios": {"id": idObj} }}
            )
            return tratamientoActualizado
        }
    })
    .catch(err => console.log(err))
}

async function agregarComida(id, comidas) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const comidaAgregada = await db.collection("tratamientos").updateOne({ "_id": new ObjectId(id) }, { $addToSet: {"tratamiento.comidas": {$each: comidas} } })

        return comidaAgregada
    })
    .catch(err => console.log(err))
}

async function agregarMedicamento(id, info, tipo) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        if(tipo === "medicamentos") {
            const tratamientoActualizado = await db.collection('tratamientos').updateOne({ "_id": new ObjectId(id) }, { $addToSet: {"tratamiento.medicamentos": {$each: info} } })
            return tratamientoActualizado
        } else if ( tipo === "ejercicios" ) {
            const tratamientoActualizado = await db.collection('tratamientos').updateOne({ "_id": new ObjectId(id) }, { $addToSet: {"tratamiento.ejercicios": {$each: info} } })
            return tratamientoActualizado
        }
        return tratamientoActualizado
    })
    .catch(err => console.log(err))
}

export {
    traerTodos,
    crear,
    traerPorIdPaciente,
    traerPorId,
    eliminar,
    editarMedicamento,
    editarComida,
    traerPorIdProfesional,
    eliminarComida,
    eliminarMedicamento,
    agregarComida,
    agregarMedicamento
}