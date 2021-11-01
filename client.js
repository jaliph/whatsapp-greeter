// const fs = require('fs')
// const path = require('path')
const { Client } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

// Use the saved values
const client = new Client({ puppeteer: { headless: false, args: ['--no-sandbox'] }, clientId: 'example' })

const initialize = () => {
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
