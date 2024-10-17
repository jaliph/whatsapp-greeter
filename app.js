const { initialize } = require('./client')

const MessageGenerator = require('./MessageGenerator')
const countryCode = '91'

const minMins = 10 * 60 * 1000
const maxMins = 30 * 60 * 1000

const CONFIG_FILE = process.env.CONFIG_FILE || 'config.json'

const config = require('./' + CONFIG_FILE)

initialize().then(async (client) => {
  if (isTestMode()) {
    console.log('Running in test mode..')
  }

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
      const job = new CronJob(getCronStr(entry.cron), async function () {
        const scheduleAt = getRandomNess()
        console.log(`You will see this message every time cron is scheduled for entry ${i}`)
        try {
          console.log(`Introducing a random delay of the message by ${scheduleAt} ms`)
          setTimeout(async () => {
            const finalMessage = entry.generator ? await MessageGenerator.getMessage(entry.generator) : entry.message
            await client.sendMessage(numberDetails._serialized, finalMessage)
            console.log(`Message :: ${finalMessage} :: sent successfully to ${entry.number}... @ ${new Date()}`)
          }, scheduleAt)
        } catch (error) {
          console.log(`Message send failure for ${entry.number} @ ${new Date()}`, error)
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

const getCronStr = (cron) => {
  if (isTestMode()) {
    return "*/2 * * * *"
  }
  return cron
}

const getRandomNess = () => {
  if (isTestMode()) {
    return 0
  }
  return Math.ceil(((Math.random() * (maxMins - minMins)) + minMins))
}

const isTestMode = () => {
  return CONFIG_FILE === 'config-test.json'
}

process.on('unhandledRejection', error => {
  console.error('unhandledRejection -> ', error)
  process.exit(1)
})
