import { Configuration, OpenAIApi } from 'openai'
require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openAI = new OpenAIApi(configuration)

export { openAI }
