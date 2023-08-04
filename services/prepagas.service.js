import MongoDB, { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })

const client = new MongoDB.MongoClient(process.env.DB_URL)

async function traerTodos () {
    return client.connect()
    .then(async function () {
        const db = client.db('eira')
        const prepagas = await db.collection('prepagas').findOne({})
        return prepagas
    })
    .catch(err => console.log(err))
}

export {
    traerTodos
}