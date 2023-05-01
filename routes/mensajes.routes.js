import express from 'express'
import { autenticacion } from '../middlewares/auth.middleware.js'
import * as MensajesController from '../controllers/mensajes.controller.js'

const route = express.Router()

route.post('/api/mensajes', [autenticacion], MensajesController.enviar)
route.get('/api/mensajes/:chatId', [autenticacion], MensajesController.traer)

export default route