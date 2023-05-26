import { openAI } from '@utils/gptHelpers'
import { procedure } from 'src/trpc'

const greeting = procedure.query(async () => {
    const response = await openAI.createCompletion({
        model: 'text-davinci-003',
        prompt: 'Say hi to Alex',
        temperature: 0,
        max_tokens: 20,
    })
    return response.data
})

export { greeting }
