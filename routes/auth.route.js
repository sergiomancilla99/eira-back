import express from 'express'
import * as UsuariosController from '../controllers/auth.controller.js'

const route = express.Router()

route.post('/api/login', UsuariosController.login)
route.post('/api/registro', UsuariosController.crear)

export default route