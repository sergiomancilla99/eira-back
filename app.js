import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import TratamientosRoutes from './routes/tratamientos.route.js'
import PacientesRoutes from './routes/pacientes.route.js'
import ProfesionalesRoutes from './routes/profesionales.route.js'
import AuthRoutes from './routes/auth.route.js'
import NotificacionRoutes from './routes/notificaciones.routes.js'
import ConexionesRoutes from './routes/conexiones.routes.js'
import ChatRoutes from './routes/chat.routes.js'
import MensajesRoutes from './routes/mensajes.routes.js'
import SolicitudesRoutes from './routes/solicitudes.route.js'
import * as SocketIO from 'socket.io'
import UsuariosRoutes from './routes/usuarios.route.js'
import RecordatoriosRoutes from './routes/recordatorios.route.js'
import ContactoRoutes from './routes/contacto.routes.js'
import Progresos from './routes/progresos.routes.js'
import Prepagas from './routes/prepagas.route.js'
import helmet from "helmet"
import './services/cronjob.js'

const app = express()
app.use(cors({origin: "*"}))
app.use(helmet())

const server = createServer(app) // crea el server
const serverSocket = new SocketIO.Server(server, {
    cors: {
        origin: 'https://eira.ar',
        methods: ['GET', 'POST']
    },
    trasport: ['websocket']
})

let usuarios = []

const agregarUsuario = (usuarioId, socketId) => {
    !usuarios.some((usuario) => usuario.usuarioId === usuarioId) &&
        usuarios.push({usuarioId, socketId})
}

const eliminarUsuario = (socketId) => {
    usuarios = usuarios.filter(usuario => usuario.socketId !== socketId)
}

const getUsuario = (usuarioId) => {
    return usuarios.find( usuario => usuario.usuarioId === usuarioId )
}

serverSocket.on('connection', (socket) => {
    socket.on("agregarUsuario", (usuarioId) => {
        agregarUsuario(usuarioId, socket.id)
        serverSocket.emit("getUsuarios", usuarios)
    })

    socket.on("logout", (socket) => {
        eliminarUsuario(socket)
        serverSocket.emit("getUsuarios", usuarios)
    })

    socket.on("enviarMensaje", ({emisorId, receptorId, mensaje}) => {
        const usuario = getUsuario(receptorId)
        usuario ? serverSocket.to(usuario.socketId).emit("getMensaje", { //entonces porque como no esta coenctado e otro user tira error de socketid
            emisorId,
            mensaje
        }) : null
    })

    socket.on('disconnect', () => {
        eliminarUsuario(socket.id)
        serverSocket.emit("getUsuarios", usuarios)
    })
})

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/', express.static('public/imgs/recetas'));
app.use('/', TratamientosRoutes)
app.use('/', PacientesRoutes)
app.use('/', ProfesionalesRoutes)
app.use('/', AuthRoutes)
app.use('/', NotificacionRoutes)
app.use('/', ConexionesRoutes)
app.use('/', ChatRoutes)
app.use('/', MensajesRoutes)
app.use('/', UsuariosRoutes)
app.use('/', RecordatoriosRoutes)
app.use('/', SolicitudesRoutes)
app.use('/', ContactoRoutes)
app.use('/', Progresos)
app.use('/', Prepagas)

const host = process.env.HOST || '0.0.0.0'
const puerto = process.env.PORT || 2020

server.listen(puerto, function() {
    console.log("Conectado a puerto", puerto)
}) 


