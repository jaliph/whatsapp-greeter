// const fs = require('fs')
// const path = require('path')
const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const WHATSAPP_DIR = process.env.WHATSAPP_DIR || '/usr/src/app/data'
console.log('Using Whatsapp Directory', WHATSAPP_DIR)
// Use the saved values
const client = new Client({
  //webVersionCache: 
  //{
  //  remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2402.5-beta.html',
  //  type: 'remote' 
  //},
  puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=old'] },
  authStrategy: new LocalAuth({ clientId: 'client-one', dataPath: WHATSAPP_DIR })
})

const initialize = () => {
  console.log('Initialising Whatsapp!!')
  return new Promise((resolve, reject) => {
    // Save session values to the file upon successful auth
    client.on('authenticated', (session) => {
      console.log('Authenticated!!')
    })

    client.on('auth_failure', async (msg) => {
      console.log('Authentication failure!!', msg)
      reject(msg)
    })

    client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr)
      qrcode.generate(qr, { small: true })
    })

    client.on('disconnected', () => {
     console.log('client was disconnected')  
     process.exit(1)
    })
    
    client.on('ready', () => {
      console.log('Client is ready!')
      resolve(client)
    })

    client.initialize()
  })
}

module.exports = {
  initialize
}
