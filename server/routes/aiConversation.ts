import { openAI } from '../utils/gptHelpers'

const aiConversation = async (req, res) => {
    try {
        const response = await openAI.createCompletion({
            model: 'text-davinci-003',
            prompt: 'Say hi to Alex',
            temperature: 0,
            max_tokens: 20,
        })
        res.status(200).json(response.data)
    } catch (error) {
        console.log(error.response.data)
    }
}

export { aiConversation }