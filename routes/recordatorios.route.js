import express from 'express'
import * as RecordatorioController from '../controllers/recordatorios.controller.js'

const route = express.Router()

route.get('/api/recordatorios/:idUsuario', RecordatorioController.traerPorUsuarioId)
route.get('/api/historial-notificaciones/:idUsuario', RecordatorioController.traerHistorialPorIdUsuario)
// route.post('/api/historial-notificaciones', RecordatorioController.crearHistorial)
route.patch('/api/historial-notificaciones', RecordatorioController.editar)

export default route