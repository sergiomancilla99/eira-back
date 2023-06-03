import * as Cron from 'node-cron'
import fetch from 'node-fetch'
import * as PacientesService from './pacientes.service.js'
import * as ProfesionalService from './profesionales.service.js'
// */30 * * * * *
Cron.schedule('*/30 * * * * *', async () => {
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
        if (hora === "07:41") {
          console.log("HORA ACTUAL:", horaActual)
          const medicamentos = recordatorio[hora]
          
          for(let medicamento of medicamentos) {
            console.log("FBNOTI", paciente.fbNotification)
            const body = {
              "data": {
                "profesional": profesional,
                "idTratamiento": idTratamiento,
              },
              "notification": {
                "title": hora,
                "body": medicamento.nombre,
                "click_action": "https://eira.ar/",
                "icon": "https://eira.ar/eira-icon.png",
                vibrate: [300, 100, 400]
              },
              // "to": paciente.fbNotification
              "to": 'fsJ1tT_A46tpGkqu-kAWmb:APA91bEfmCksbY7iMgL5lZ0zaivUkaQXoLrhVwi7kvuBPbenP1EiRgZ7M1H_oNAU1NQahtiSXw9zeYT-N_7BAkiHyq9QPAm7ox7aoQt6Mhf4Yc0dVMDZJE6U8yxkGOMJy9QXinyFvMKT'
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


  // const body = {
  //   "notification": {
  //     "title": "TEST CRON",
  //     "body": "TESTING CRON JOB",
  //     "click_action": "https://eira.ar/",
  //     "icon": "https://i.imgur.com/5zO5cce.png"
  //   },
  //   "to": 'eg_ljqXoe_eMI3vM_Dkho0:APA91bHCxNDJhZm4KzWjmyTy4DSq2rX2N2Z6Y29EQ_FF1VFmcTtbAzid-fkNUYBLCNeci2ZGGzdpEL1eflJA9Lx-ump-3x0K-5WNWm7eIrHpTyq328dsiIK18kkqBJ_r-vZp7VwRsnVC'
  // }
  // fetch('https://fcm.googleapis.com/fcm/send', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': "key=AAAALADXWMA:APA91bEDwS8TFdfyx0_XottXr5EgzwhVXqnvwHPCEpeDgf3tqKDVSJ6c_EDpYcZk16eQWLbXcT3dWn6J_BVRdJYqNIFfEGv6TOGsP3V665cxeJbpCZFBSG6ogNZq9Hrdn-bgQRZCy9E3"
  //   },
  //   body: JSON.stringify(body)
  // })
  //   .then(res => res.json())
});