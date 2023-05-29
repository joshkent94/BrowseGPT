import { procedure } from '@utils/trpc'
import z from 'zod'
import { Configuration, OpenAIApi } from 'openai'

const greeting = procedure
    .input(z.object({ firstName: z.string(), apiKey: z.string() }))
    .query(async (opts) => {
        const name = opts.input.firstName
        const apiKey = opts.input.apiKey
        // const configuration = new Configuration({
        //     apiKey,
        // })
        // const openAI = new OpenAIApi(configuration)
        // const response = await openAI.createCompletion({
        //     model: 'text-davinci-003',
        //     prompt: `Say hi to ${name}`,
        //     temperature: 0,
        //     max_tokens: 20,
        // })
        // return response.data
        return { choices: [{ text: "Hi Josh!" }]}
    })

export { greeting }
