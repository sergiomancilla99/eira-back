import * as Cron from 'node-cron'
import fetch from 'node-fetch'
import * as PacientesService from './pacientes.service.js'

Cron.schedule('* * * * * ', async () => {
  console.log('cada min capo')
  const pacientes = await PacientesService.traerTodosNotif()
  //console.log(pacientes)
  // console.log(pacientes[0].recordatorios)
  //console.log("RECOR", pacientes[0].recordatorios)
  
  for (let i = 0; i < pacientes[0].recordatorios.length; i++) {
    //console.log("acaaa", pacientes[0].recordatorios[i].recordatorios)
    const recordatorio = pacientes[0].recordatorios[i].recordatorios
    // const idTratamiento = recordatorios[i].idTratamiento
    for (const hora in recordatorio) {
      
      if (hora === "19:30") {
        const medicamentos = recordatorio[hora]
        for(let medicamento of medicamentos) {
          console.log(medicamento.nombre)
          console.log("horaaaaa",hora)
          const body = {
            "notification": {
              "title": hora,
              "body": medicamento.nombre,
              "click_action": "https://eira.ar/",
              "icon": "https://i.imgur.com/5zO5cce.png"
            },
            "to": 'cTFOfVjRu53B92yQkZh0BF:APA91bEKTYJojjgDOy0W409YuMV23jUtmUI0F0F3cQZAHeJENHoGhUB2RoAsARTPTo7TvYWLy_by5Me2G8BC1uHPD4sOl6cK3UhyzMcJ3kpDb0hRPo5NYFR2-iRRVDZLOexLeIMLs5ve'
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