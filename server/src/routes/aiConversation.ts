import { openAI } from '@utils/gptHelpers'
import { Request, Response } from 'express'

const aiConversation = async (req: Request, res: Response) => {
    try {
        const response = await openAI.createCompletion({
            model: 'text-davinci-003',
            prompt: 'Say hi to Alex',
            temperature: 0,
            max_tokens: 20,
        })
        res.status(200).json(response.data)
    } catch (error: any) {
        console.log(error.response.data)
    }
}

export { aiConversation }
