import fetch from 'node-fetch'
import { DateTime } from 'luxon'
import * as ProgresosService from '../services/progresos.service.js'
import { ObjectId } from 'mongodb'

function traerPorIdPaciente(req, res) {
    ProgresosService.traerPorIdPaciente(req.params.id)
    .then((resp) => {
        resp ? res.status(200).json(resp) :
        res.status(404).json({
            response: false,
            message: "Hubo un error" 
        })
    })
}

function traerPorIdPacienteYIdProfesional(req, res) {
    ProgresosService.traerPorIdPacienteYIdProfesional(req.params.id, req.params.idProfesional)
    .then((resp) => {
        resp ? res.status(200).json(resp) :
        res.status(404).json({
            response: false,
            message: "Hubo un error" 
        })
    })
}

function confirmarActividad(req, res) {
    const actividad = {
        ...req.body.actividad,
        idActividad: new ObjectId()
    }
    const paciente = {
        ...req.body.paciente,
        _id: new ObjectId(req.body.paciente._id)
    }
    const profesional = {
        ...req.body.profesional,
        _id: new ObjectId(req.body.profesional._id)
    }

    const frecuenciaHoraria = req.body.frecuenciaHoraria
    const idTratamiento = new ObjectId(req.body.idTratamiento)
    const diagnostico = req.body.diagnostico
    ProgresosService.confirmarActividad(paciente, profesional, frecuenciaHoraria, actividad, idTratamiento, diagnostico)
    .then((resp) => {
        resp ? res.status(200).json(resp) :
        res.status(404).json({
            response: false,
            message: "Hubo un error" 
        })
    })
}

function negarActividad(req, res) {
    const actividad = {
        ...req.body.actividad,
        idActividad: new ObjectId()
    }
    const paciente = {
        ...req.body.paciente,
        _id: new ObjectId(req.body.paciente._id)
    }
    const profesional = {
        ...req.body.profesional,
        _id: new ObjectId(req.body.profesional._id)
    }
    const idTratamiento = new ObjectId(req.body.idTratamiento)
    const diagnostico = req.body.diagnostico
    ProgresosService.confirmarActividad(paciente, profesional, actividad, idTratamiento, diagnostico)
    .then((resp) => {
        resp ? res.status(200).json(resp) :
        res.status(404).json({
            response: false,
            message: "Hubo un error" 
        })
    })
}

function editar (req, res) {
    const nuevaHora = {
        ...req.body.nuevaHora,
        idActividad: new ObjectId(req.body.nuevaHora.idActividad),
        confirmado: req.body.nuevaHora.confirmado === "true" ? true : false
    }
    
    ProgresosService.editar(req.body.idProgreso, nuevaHora)
    .then(function (progreso) {
        progreso ?
        res.status(200).json(progreso) :
        res.status(404).json({mensaje: "No hay progreso para editar.." })
    })
}


export {
    traerPorIdPaciente,
    confirmarActividad,
    traerPorIdPacienteYIdProfesional,
    editar,
    negarActividad
   
}