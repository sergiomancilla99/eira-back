import * as Cron from 'node-cron'
import fetch from 'node-fetch'
import * as PacientesService from './pacientes.service.js'

Cron.schedule('* * * * * ', async () => {
  console.log('cada min capo')
  const pacientes = await PacientesService.traerTodos()
  //console.log(pacientes)
  // console.log(pacientes[0].recordatorios)
  //console.log("RECOR", pacientes[0].recordatorios)
  for (let i = 0; i < pacientes[0].recordatorios.length; i++) {
    console.log("acaaa", pacientes[0].recordatorios[i].recordatorios)
    const recordatorio = pacientes[0].recordatorios[i].recordatorios
    // const idTratamiento = recordatorios[i].idTratamiento
    for (const hora in recordatorio) {
      if (hora === "19:30") {
        const body = {
          "notification": {
            "title": "TEST CRON",
            "body": "TESTING CRON JOB",
            "click_action": "https://eira.ar/",
            "icon": "https://i.imgur.com/5zO5cce.png"
          },
          "to": 'e1PzZbktxlE_sKwzwfbgp5:APA91bGvMvLe6BN8xY9Msah512nBSIiv3et8xDdz3T-wmD79XuBhNMB57Es-6sNETBp0H_IrPuR7frC-YrAT7EgjmzJorY6wep33qabgjbhcd0d3RsN5FcS72RcBuxV3S4WsjWWpvPQ1'
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