import express from 'express'
import * as ProfesionalesController from '../controllers/profesionales.controller.js'
import { autenticacion, medicoVerificado, administrador } from '../middlewares/auth.middleware.js'
import multer from 'multer'
import { dirname, extname, join } from 'path'
import { fileURLToPath } from 'url'

const currrentDir = dirname(fileURLToPath(import.meta.url))
const mimetypes = ['image/jpeg', 'image/png']

const uploadImg = multer({
    storage: multer.diskStorage({
        destination: join(currrentDir, '/public/imgs/recetas'),
        filename: (req, file, cb) => {
            const fileExtension = extname(file.originalname)
            const fileName = file.originalname.split(fileExtension)[0]

            cb(null, `${Date.now()}-${fileName}${fileExtension}`)
        }
    }),
    fileFilter: (req, file, cb) => {
        if(mimetypes.includes(file.mimetype)) cb(null, true)
        else cb(new Error(`Solo se acepta imagenes jpg/png`))
    },
    limits: {
        fieldSize: 10000000
    }
})

const route = express.Router()

route.get('/api/profesionales', [autenticacion], ProfesionalesController.traerTodos)
route.get('/api/profesionales/:id', ProfesionalesController.traerPorId)
route.patch('/api/profesionales/:id', [autenticacion], ProfesionalesController.editar)
route.delete('/api/profesionales/:id', [autenticacion], ProfesionalesController.eliminar)
route.get('/api/profesionales/:id/pacientes', [autenticacion, medicoVerificado], ProfesionalesController.traerPacientes)
route.delete('/api/profesionales/:idProfesional/pacientes/:idPaciente', [autenticacion, medicoVerificado], ProfesionalesController.eliminarPaciente)
route.patch('/api/profesionales/verificacion/:id', [autenticacion, administrador], ProfesionalesController.verificarMedico)
route.get('/api/recetas/:id', [autenticacion, medicoVerificado], ProfesionalesController.traerPedidosRecetas)
route.post('/api/recetas', [uploadImg.single('imagen'), autenticacion, medicoVerificado], ProfesionalesController.enviarReceta)

export default route