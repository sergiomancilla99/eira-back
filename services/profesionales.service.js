import MongoDB, { ObjectId } from 'mongodb'

const client = new MongoDB.MongoClient('mongodb://127.0.0.1:27017')

async function traerTodos () {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const profesionales = await db.collection('medicos').find().toArray()
        return profesionales
    })
    .catch(err => console.log(err))
}

async function traerPacientes (idProfesional) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const pacientes = await db.collection('conexiones').findOne({"medico": new ObjectId(idProfesional)})
        return pacientes.pacientes
    })
    .catch(err => console.log(err))
}

async function traerPorId(idProfesional) {
    return client.connect()
    .then( async function () {
        const db = client.db('eira')
        const profesional = await db.collection('medicos').findOne({"_id": new ObjectId(idProfesional)})
        return { ...profesional, password: undefined }
    } )
    .catch(err => console.log(err))
}

async function editar (id, usuario) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const usuarioEditado = await db.collection('medicos').updateOne({"_id": new ObjectId(id)}, {$set: usuario})
        await db.collection('solicitudes').updateMany({'emisor._id': ObjectId(id)}, {$set: {'emisor': {'_id': new ObjectId(id), 'nombre': usuario.nombre, 'apellido': usuario.apellido, 'email': usuario.email}}})
        await db.collection('solicitudes').updateMany({'receptor._id': ObjectId(id)}, {$set: {'receptor': {'_id': new ObjectId(id), 'nombre': usuario.nombre, 'apellido': usuario.apellido, 'email': usuario.email}}})
        await db.collection('tratamientos').updateMany({'profesional.id_medico': ObjectId(id)}, {$set: {'profesional.id_medico': new ObjectId(id), 'profesional.nombre': usuario.nombre, 'profesional.apellido': usuario.apellido}})

        return usuarioEditado
    })
    .catch(err => console.log(err))
}

async function eliminar (id) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const usuarioEliminado = await db.collection('medicos').deleteOne({"_id": ObjectId(id)})
        await db.collection('conexiones').deleteOne({'medico': ObjectId(id)})
        await db.collection('recetas').deleteOne({'medico': ObjectId(id)})
        await db.collection('tratamientos').deleteMany({'profesional.id_medico': ObjectId(id)})
        const chats = await db.collection('chat').find({'usuarios': ObjectId(id)}).toArray()
        if(chats) {
            for (let chat of chats) {
                await db.collection('mensajes').deleteMany({'chat': chat._id})
            }
        }
        await db.collection('chat').deleteMany({'usuarios': ObjectId(id)})
        await db.collection('solicitudes').deleteMany({$or: [{'emisor._id': ObjectId(id)}, {'receptor._id': ObjectId(id)}]})

        return usuarioEliminado
    })
    .catch(err => console.log(err))
}

async function eliminarPaciente (idProfesional, idPaciente) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const pacienteEliminado = await db.collection('conexiones').updateOne(
                { "medico": ObjectId(idProfesional) },
                { $pull: { "pacientes": { "_id": new ObjectId(idPaciente) }} }
            )

            await db.collection('recetas').updateOne(
                { "medico": ObjectId(idProfesional) },
                { $pull: { "recetas": { "idPaciente": new ObjectId(idPaciente) }} }
            )

            await db.collection('tratamientos').deleteMany(
                { $and: [{'profesional.id_medico': new ObjectId(idProfesional) }, {"id_paciente": new ObjectId(idPaciente)}] }
            )

            await db.collection('solicitudes').deleteMany({$or: [{ $and : [{'emisor._id': ObjectId(idPaciente)}, {'receptor._id': ObjectId(idProfesional)}]},{ $and : [{'emisor._id': ObjectId(idProfesional)}, {'receptor._id': ObjectId(idPaciente)}]} ]})

            const chat = await db.collection('chat').findOne({'usuarios': {$all: [ObjectId(idPaciente), ObjectId(idProfesional)]}})

            await db.collection('mensajes').deleteMany({'chat': chat._id})
            await db.collection('chat').deleteMany({'_id': ObjectId(chat._id)})

        return pacienteEliminado
    })
    .catch(err => console.log(err))
}

async function verificarMedico(id) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        let verificar = null
        const profesional = await db.collection('medicos').findOne({"_id": ObjectId(id)})
        profesional.verificado ? verificar = false : verificar = true
        const usuarioEditado = await db.collection('medicos').updateOne({"_id": new ObjectId(id)}, {$set: {verificado: verificar}})
        return usuarioEditado
    })
    .catch(err => console.log(err))
}

async function traerPedidosRecetas(id) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const pedidos = await db.collection('recetas').findOne({'medico': ObjectId(id)}, {projection: {'recetas': 1, '_id': 0}})
        return pedidos
    })
    .catch(err => console.log(err))
}

async function enviarReceta({file, posicion}) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        let update = {
            $set: {}
        }
        update.$set[`recetas.${posicion}.imagen`] =`${file.filename}`
        update.$set[`recetas.${posicion}.enviado`] = true
        const pedidos = await db.collection('recetas').updateOne(
            { "medico": ObjectId("6376b8cb7afdbb7ae6f3a992")},
            update
        )
        return pedidos
    })
    .catch(function(err) {
        console.log(err)
    })
}

export {
    traerTodos,
    traerPorId,
    editar,
    eliminar,
    traerPacientes,
    eliminarPaciente,
    verificarMedico,
    traerPedidosRecetas,
    enviarReceta

}