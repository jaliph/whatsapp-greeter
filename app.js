const { initialize } = require('./client')
const config = require('./config.json')
const countryCode = '91'

initialize().then(async (client) => {
  console.log('Scheduling as per the crons!!')
  for (const i in config) {
    const entry = config[i]
    const sanitizedNumber = entry.number.toString().replace(/[- )(]/g, '')
    const finalNumber = `${countryCode}${sanitizedNumber.substring(sanitizedNumber.length - 10)}`
    console.log('Checking for Number -> ', finalNumber)
    const numberDetails = await client.getNumberId(finalNumber)
    console.log('Result -> ', JSON.stringify(numberDetails))
    if (numberDetails) {
      const CronJob = require('cron').CronJob
      const job = new CronJob(entry.cron, async function () {
        console.log(`You will see this message every time cron is scheduled for entry ${i}`)
        try {
          await client.sendMessage(numberDetails._serialized, entry.message)
          console.log(`Message sent successfully to ${entry.number}...`)
        } catch (error) {
          console.log(`Message send failure for ${entry.number}`)
        }
      }, null, true, entry.timezone)
      job.start()
    } else {
      console.log(`${entry.number} is an invalid number skipping it..`)
    }
  }
}).catch((err) => {
  console.log('Initialization failed.. exiting...', err)
})
