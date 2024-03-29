import express from 'express'
import * as UsuariosController from '../controllers/auth.controller.js'

const route = express.Router()

route.post('/api/login', UsuariosController.login)
route.post('/api/registro', UsuariosController.crear)
route.patch('/api/actualizarToken', UsuariosController.actualizarToken)
export default route