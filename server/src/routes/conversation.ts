import { procedure } from '@utils/trpc'
import z from 'zod'
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from 'openai'

const conversation = procedure
    .input(z.object({ firstName: z.string(), apiKey: z.string(), conversation: z.array(z.object({ role: z.enum([ChatCompletionRequestMessageRoleEnum.Assistant, ChatCompletionRequestMessageRoleEnum.User]), content: z.string() })) }))
    .query(async (opts) => {
        const name = opts.input.firstName
        const apiKey = opts.input.apiKey
        const configuration = new Configuration({
            apiKey,
        })
        const openAI = new OpenAIApi(configuration)
        const response = await openAI.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are an AI assistant that aids users as they are browsing the web, called BrowseGPT. You are helpful, creative, clever, and very friendly. You are helping ${name}. Introduce yourself in two sentences`,
                },
                ...opts.input.conversation
            ],
        })
        return response.data
        // return {
        //     choices: [{
        //         message: {
        //             role: 'assistant',
        //             content: 'Hi Josh!'
        //         }
        //     }]
        // }
    })

export { conversation }
