const cacache = require('cacache')
const path = require('path')
const fs = require('fs')

class MessageGenerator {
  constructor(opts) {
    this.cachePath = path.join(__dirname, './.cache')
  }

  async getMessage (fileName) {
    const messageFile = path.join(__dirname, './' + fileName)
    const messages = messageFileParser(messageFile)
    const counterName = fileName
    let currentCounterfromCache = await this.get(counterName)
    if (!currentCounterfromCache) {
      currentCounterfromCache = 0
    }
    if (currentCounterfromCache >= messages.length) currentCounterfromCache = 0
    const todaysMessage = messages[Number(currentCounterfromCache)]
    currentCounterfromCache = Number(currentCounterfromCache) + 1
    await this.set(counterName, currentCounterfromCache + '')
    return todaysMessage
  }
  // fetchGoodNightMessageforWife: () => {
  //   const messages = require('./gn-wife.json')
  //   if (messageGetters.fetchGoodNightMessageforWifeCounter >= messages.length) messageGetters.fetchGoodNightMessageforWifeCounter = 0
  //   const todaysMessage = messages[messageGetters.fetchGoodNightMessageforWifeCounter]
  //   messageGetters.fetchGoodNightMessageforWifeCounter++
  //   return todaysMessage
  // }

  async get(key) {
    try {
      let { data } = await cacache.get(this.cachePath, key)
      return data.toString()
    } catch (error) {
      console.error(`Some error happened for the key ${key} !`, error)
    }
    return undefined
  }
  
  async set(key, value) {
    await cacache.put(this.cachePath, key, value)
  }
}

const fileReader = (file) => {
  return fs.readFileSync(file, 'utf-8')
}

const messageFileParser = (filePath) => {
  try {
    return JSON.parse(fileReader(filePath))
  } catch (error) {
    console.error('Error occurred while parsing message file :: ', error)
  }
  return []
}


// const driver = async () => {
//   const messageGenerator = new MessageGenerator()
//   for(let i = 0; i < 147; i++ ) {
//     await messageGenerator.getMessages('gm-wife.json')
//     await messageGenerator.getMessages('gn-wife.json')
//   }
//   console.log(await messageGenerator.getMessages('gm-wife.json'))
//   console.log(await messageGenerator.getMessages('gn-wife.json'))
//   // await messageGenerator.set('foo', '1')
//   // let data = await messageGenerator.get('foo')
//   // let data1 = await messageGenerator.get('foo1')
//   // console.log(Number(data))
//   // console.log(data1)
 
// }

module.exports = new MessageGenerator()