import express from 'express'
import * as RecordatorioController from '../controllers/recordatorios.controller.js'

const route = express.Router()

route.get('/api/recordatorios/:idUsuario', RecordatorioController.traerPorUsuarioId)

export default route