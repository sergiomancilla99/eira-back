import express from 'express'
import * as SolicitudesController from '../controllers/solicitudes.controller.js'
import { autenticacion } from '../middlewares/auth.middleware.js'

const route = express.Router()
route.get('/api/solicitudes/:idUsuario', [autenticacion], SolicitudesController.traerPorUsuario)
route.post('/api/solicitudes', [autenticacion], SolicitudesController.aceptarSolicitud)
route.post('/api/solicitud', [autenticacion], SolicitudesController.enviarSolicitud)

export default route