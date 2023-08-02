import * as Cron from 'node-cron'
import fetch from 'node-fetch'
import * as PacientesService from './pacientes.service.js'
import * as ProfesionalService from './profesionales.service.js'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'variables.env' })
// */30 * * * * *
Cron.schedule('* * * * *', async () => {
  console.log('cada min capo')
  const pacientes = await PacientesService.traerTodosNotif()
  // console.log(paciente.recordatorios)
  //console.log("RECOR", paciente.recordatorios)
  const date = new Date()
  const horaC = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minutosC = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()

  let horaActual = `${horaC}:${minutosC}`
  
 for(let paciente of pacientes) {
  if(paciente.recordatorios.length > 0) {
  for (let i = 0; i < paciente.recordatorios.length; i++) {
    //console.log("acaaa", paciente.recordatorios[i].recordatorios)
      const recordatorio = paciente.recordatorios[i].recordatorios
      const idTratamiento = paciente.recordatorios[i].idTratamiento.toString()
      const idProfesional = paciente.recordatorios[i].idProfesional.toString()
      const profesional = await ProfesionalService.traerPorId(idProfesional)
      for (const hora in recordatorio) {
        if (hora === horaActual) {
          console.log("HORA ACTUAL:", horaActual)
          const medicamentos = recordatorio[hora]
          
          for(let medicamento of medicamentos) {
            console.log("FBNOTI", paciente.fbNotification)

            const body = {
              "data": {
                "profesional": {...profesional, _id: idProfesional, password: "undefined"},
                "idTratamiento": idTratamiento
              },
              "notification": {
                "title": "Eira",
                "body": `Es hora de tomar ${medicamento.nombre}`,
                "click_action": `https://eira.ar/paciente/confirmacion?idProfesional=${idProfesional}&nombreProfesional=${profesional.nombre}&apellidoProfesional=${profesional.apellido}&medicamento=${medicamento.nombre}&idTratamiento=${idTratamiento}`,
                "icon": "https://eira.ar/eira-icon.png",
                vibrate: [300, 100, 400]
              },
              "to": paciente.fbNotification
              // "to": ''
            }
            console.log("body", body)
            fetch('https://fcm.googleapis.com/fcm/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${process.env.KEY_FIREBASE}`
              },
              body: JSON.stringify(body)
            })
              .then(res => res.json())
          }
          
        }
      }
    }
  
  }
 }

});