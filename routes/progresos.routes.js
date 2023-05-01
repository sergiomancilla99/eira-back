import express from 'express'
import * as Progresos from '../controllers/progresos.controller.js'
import { autenticacion } from '../middlewares/auth.middleware.js'

const route = express.Router()

route.get('/api/progresos/:id', [autenticacion], Progresos.traerPorIdPaciente)
route.get('/api/progresos/:id/:idProfesional', [autenticacion], Progresos.traerPorIdPacienteYIdProfesional)
route.post('/api/progresos/confirmar', [autenticacion], Progresos.confirmarActividad)
route.post('/api/progresos/negar', [autenticacion], Progresos.negarActividad)
route.patch('/api/progresos/editar', [autenticacion], Progresos.editar)

export default route