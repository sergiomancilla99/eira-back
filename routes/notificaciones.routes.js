import express from 'express'
import { autenticacion } from '../middlewares/auth.middleware.js'
import * as NotificacionMail from '../controllers/notificaciones.controller.js'

const route = express.Router()

route.post('/api/notificacion', [autenticacion], NotificacionMail.enviarNotificacionMail)
route.post('/api/notificacionFB', [autenticacion], NotificacionMail.enviarNotificacionFB)

export default route