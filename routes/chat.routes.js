import express from 'express'
import { autenticacion } from '../middlewares/auth.middleware.js'
import * as ChatController from '../controllers/chat.controller.js'

const route = express.Router()

route.post('/api/chat', [autenticacion], ChatController.crear)
route.get('/api/chat/:usuarioId', [autenticacion], ChatController.traerPorUsuarioId) // trae los chats donde se encuentre el id usuario
route.get('/api/chat/:usuarioId1/:usuarioId2', [autenticacion], ChatController.traerUno)

export default route