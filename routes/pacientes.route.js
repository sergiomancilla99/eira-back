import express from 'express'
import * as PacientesController from '../controllers/pacientes.controller.js'
import { autenticacion } from '../middlewares/auth.middleware.js'

const route = express.Router()

route.get('/api/pacientes', PacientesController.traerTodos)
route.get('/api/pacientes/:id', [autenticacion], PacientesController.traerPorId)
route.get('/api/pacientes/:id/historia', [autenticacion], PacientesController.traerHistoriaClinica)
route.delete('/api/pacientes/:id', [autenticacion], PacientesController.eliminar)
route.post('/api/pacientes/:id/historia-clinica', [autenticacion], PacientesController.crearHistoriaClinica)
route.patch('/api/pacientes/:id/historia-clinica', [autenticacion],PacientesController.editarHistoriaClinica)
route.patch('/api/pacientes/:id', [autenticacion], PacientesController.editar)
route.get('/api/pacientes/misMedicos/:id', [autenticacion], PacientesController.traerMisMedicos)
route.post('/api/pacientes/pedidoReceta', [autenticacion], PacientesController.pedidoReceta)
route.get('/api/pacientes/misPedidos/:id', [autenticacion], PacientesController.traerRecetasPorId)
route.post('/api/examenes/urlFile', [autenticacion], PacientesController.urlFile)

export default route