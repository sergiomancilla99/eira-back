import express from 'express'
import * as ContactoController from '../controllers/contacto.controller.js'

const route = express.Router()

route.post('/api/contacto', ContactoController.contactoWeb)

export default route