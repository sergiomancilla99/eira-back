import express from 'express'
import { autenticacion } from '../middlewares/auth.middleware.js'
import * as ConexionesController from '../controllers/conexiones.controller.js'

const route = express.Router()

route.get('/api/conexiones/:idUsuario',[autenticacion], ConexionesController.traerPorUsuario)

export default route