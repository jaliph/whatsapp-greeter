const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const runner = async () => {
  // const completion = await openai.createCompletion({
  //   engine: 'davinci',
  //   prompt: 'What is the meaning of life?',
  //   maxTokens: 50,
  //   temperature: 0.5,
  //   stop: '\n'
  // })
  // console.log(JSON.stringify(completion.data.choices, null , 2))
  try {
    const completion = await openai.createCompletion({
      model:"text-davinci-003",
      prompt:"What is the name of the first US president?",
      temperature:1.4,
      max_tokens:200,
      top_p:1.0,
      frequency_penalty:0.0,
      presence_penalty:0.0
    });
    console.log(JSON.stringify(completion.data.choices, null, 2));
  } catch (error) {
    console.error('Uh oh!! ', error.message)
  }
  
  
}

runner()

