import express from 'express'
import * as TratamientosController from '../controllers/tratamientos.controller.js'
import { autenticacion, medicoVerificado } from '../middlewares/auth.middleware.js'

const route = express.Router()

route.get('/api/tratamientos', TratamientosController.traerTodos)
route.get('/api/tratamientos/paciente/:idPaciente', [autenticacion], TratamientosController.traerPorIdPaciente)
route.get('/api/tratamientos/profesional/:idProfesional/paciente/:idPaciente', [autenticacion], TratamientosController.traerPorIdProfesional)
route.get('/api/tratamientos/:id', [autenticacion, medicoVerificado], TratamientosController.traerPorId)
route.get('/api/tratamientos-traer/:id', [autenticacion], TratamientosController.traerPorId)
route.post('/api/tratamientos', [autenticacion, medicoVerificado], TratamientosController.crear)
route.delete('/api/tratamientos/:id', [autenticacion, medicoVerificado], TratamientosController.eliminar)
route.patch('/api/tratamientos/:id', [autenticacion, medicoVerificado], TratamientosController.editarMedicamento)
route.patch('/api/tratamientos/comida/:id', [autenticacion, medicoVerificado], TratamientosController.editarComida)
route.patch('/api/tratamientos/comida/eliminar/:id', [autenticacion, medicoVerificado], TratamientosController.eliminarComida)
route.patch('/api/tratamientos/medicamento-ejercicio/:id', [autenticacion, medicoVerificado], TratamientosController.eliminarMedicamento)
route.patch('/api/tratamientos/:id/comida/agregar', [autenticacion, medicoVerificado], TratamientosController.agregarComida)
route.patch('/api/tratamientos/:id/medicamento-ejercicio/agregar', [autenticacion, medicoVerificado], TratamientosController.agregarMedicamento)

export default route