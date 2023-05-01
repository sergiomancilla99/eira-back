import MongoDB, { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })

const client = new MongoDB.MongoClient(process.env.DB_URL)

async function traerTodos () {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const pacientes = await db.collection('pacientes').find({"admin": { $ne: true }},{projection: {"password": 0}}).toArray()
        return pacientes
    })
    .catch(err => console.log(err))
}

async function traerPorId(idpaciente) {
    return client.connect()
    .then( async function () {
        const db = client.db('eira')
        const paciente = await db.collection('pacientes').findOne({"_id": ObjectId(idpaciente)})
        return { ...paciente, password: undefined }
    } )
    .catch(err => console.log(err))
}

async function traerHistoriaClinica(idpaciente) {
    return client.connect()
    .then( async function () {
        const db = client.db('eira')
        const historiaClinica = await db.collection('historias-clinicas').findOne({"paciente": ObjectId(idpaciente)})
        return historiaClinica
    } )
    .catch(err => console.log(err))
}

async function editar (id, usuario) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const usuarioEditado = await db.collection('pacientes').updateOne({"_id": new ObjectId(id)}, {$set: {...usuario}})
        await db.collection('solicitudes').updateMany({'emisor._id': ObjectId(id)}, {$set: {'emisor': {'_id': new ObjectId(id), 'nombre': usuario.nombre, 'apellido': usuario.apellido, 'email': usuario.email, 'dni': usuario.dni}}})
        await db.collection('solicitudes').updateMany({'receptor._id': ObjectId(id)}, {$set: {'receptor': {'_id': new ObjectId(id), 'nombre': usuario.nombre, 'apellido': usuario.apellido, 'email': usuario.email, 'dni': usuario.dni}}})

        const recetas = await db.collection('recetas').find({'recetas.idPaciente': ObjectId(id)}).toArray()
        if(recetas) {
            for(let receta of recetas) {
                for(let info of receta.recetas) {
                    if(info.idPaciente == id) {
                        await db.collection('recetas').updateMany({'recetas.idPaciente': ObjectId(id)}, {$set: {'recetas.$': {'idPaciente': new ObjectId(id), 'paciente': usuario.nombre + ' ' + usuario.apellido, 'obraSocial': usuario.obraSocial, 'afiliado': usuario.afiliado, 'medicamento': info.medicamento, 'enviado': info.enviado}}})
                    }
                }
            }
        }
        await db.collection('conexiones').updateMany({"pacientes._id": new ObjectId(id)}, {$set: {"pacientes.$": {"_id": new ObjectId(id), 'nombre': usuario.nombre, 'apellido': usuario.apellido, 'email': usuario.email, "dni": usuario.dni}}})

        return usuarioEditado
    })
    .catch(err => console.log(err))
}

async function eliminar (id) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const usuarioEliminado = await db.collection('pacientes').findOne({"_id": ObjectId(id)})
        await db.collection('tratamientos').deleteOne({'id_paciente': ObjectId(id)})
        await db.collection('historias-clinicas').deleteOne({'paciente': ObjectId(id)})
        await db.collection('recordatorios').deleteOne({'idUsuario': ObjectId(id)})
        await db.collection('solicitudes').deleteMany({$or: [{'emisor._id': ObjectId(id)}, {'receptor._id': ObjectId(id)}]})
        const chats = await db.collection('chat').find({'usuarios': ObjectId(id)}).toArray()
        if(chats) {
            for (let chat of chats) {
                await db.collection('mensajes').deleteMany({'chat': chat._id})
            }
        }
        await db.collection('chat').deleteMany({'usuarios': ObjectId(id)})
        await db.collection('conexiones').updateMany({'pacientes._id': ObjectId(id) }, {$pull: {'pacientes': { '_id': ObjectId(id) }}})
        await db.collection('recetas').updateMany({'recetas.idPaciente': ObjectId(id)}, {$pull: {'recetas': { 'idPaciente': ObjectId(id) }}})

        return usuarioEliminado
    })
    .catch(err => console.log(err))
}

async function crearHistoriaClinica(historia) {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const historiaNueva = await db.collection('historias-clinicas').insertOne({...historia, paciente: new ObjectId(historia.paciente)})
        return historiaNueva
    })
    .catch(err => console.log(err))
}

async function traerMisMedicos(id) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const medicos = await db.collection('conexiones').find({"pacientes._id": ObjectId(id)}, {projection: {'medico': 1, '_id': 0}}).toArray()
        return medicos
    })
    .catch(err => console.log(err))
}

async function pedidoReceta(receta) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const pedido = await db.collection('recetas').updateOne({"medico": new ObjectId(receta.medico)},{$push: {"recetas": receta.pedido}})
        return pedido
    })
    .catch(err => console.log(err))
}

async function traerRecetasPorId(id) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const pedidos = await db.collection('recetas').find({'recetas.idPaciente': new ObjectId(id)}, {projection: {'_id': 0}}).toArray()
        return pedidos
    })
    .catch(err => console.log(err))
}

async function traerRecetas(idPaciente) {
    return client.connect()
    .then(async function() {
        const db = client.db('eira')
        const recetas = await db.collection('recetas').find({'recetas.paciente._id': new ObjectId(idPaciente)}).toArray()
        return recetas
    })
    .catch(function(err) {
        console.log(err)
    })
}

export {
    traerTodos,
    traerPorId,
    traerHistoriaClinica,
    editar,
    crearHistoriaClinica,
    eliminar,
    traerMisMedicos,
    pedidoReceta,
    traerRecetasPorId

}