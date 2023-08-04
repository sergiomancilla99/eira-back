import express from 'express'
import * as PrepagasController from '../controllers/prepagas.controller.js'

const route = express.Router()

route.get('/api/prepagas', PrepagasController.traerTodos)

export default route