import * as Cron from 'node-cron'
import fetch from 'node-fetch'
import * as PacientesService from './pacientes.service.js'
import * as ProfesionalService from './profesionales.service.js'
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
      const idTratamiento = paciente.recordatorios[i].idTratamiento
      const idProfesional = paciente.recordatorios[i].idProfesional.toString()
      const profesional = await ProfesionalService.traerPorId(idProfesional)
      for (const hora in recordatorio) {
        if (false) {
          console.log("HORA ACTUAL:", horaActual)
          const medicamentos = recordatorio[hora]
          
          for(let medicamento of medicamentos) {
            console.log("FBNOTI", paciente.fbNotification)
            const body = {
              "data": {
                "profesional": profesional,
                "idTratamiento": idTratamiento
              },
              "notification": {
                "title": hora,
                "body": medicamento.nombre,
                "click_action": "https://eira.ar/paciente/confirmacion",
                "icon": "https://eira.ar/eira-icon.png",
                vibrate: [300, 100, 400]
              },          
              "to": paciente.fbNotification
              // "to": ''
            }
            fetch('https://fcm.googleapis.com/fcm/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': "key=AAAALADXWMA:APA91bEDwS8TFdfyx0_XottXr5EgzwhVXqnvwHPCEpeDgf3tqKDVSJ6c_EDpYcZk16eQWLbXcT3dWn6J_BVRdJYqNIFfEGv6TOGsP3V665cxeJbpCZFBSG6ogNZq9Hrdn-bgQRZCy9E3"
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