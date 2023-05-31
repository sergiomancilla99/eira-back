import * as Cron from 'node-cron'

Cron.schedule('* * * * * ', () => {
    console.log('cada min capo');
  });