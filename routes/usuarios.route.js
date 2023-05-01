import express from 'express'
import * as UsuariosController from '../controllers/usuarios.controller.js'
import { autenticacion } from '../middlewares/auth.middleware.js'

const route = express.Router()

route.patch('/api/usuarios/:id/cambiarConstrasena', UsuariosController.cambiarContrasena)
route.patch('/api/usuarios/olvideContrasena', UsuariosController.olvideContrasena)
route.patch('/api/usuarios/:token/:email', UsuariosController.recuperarContrasena)
route.patch('/api/usuarios/:token/:email', UsuariosController.recuperarContrasena)
route.get('/api/usuarios/:idUsuario', [autenticacion], UsuariosController.traerProfesionalesVinculados)
route.post('/api/usuarios/profesional', [autenticacion], UsuariosController.agregarProfesional)
route.post('/api/usuarios/paciente', [autenticacion], UsuariosController.agregarProfesional)

export default route