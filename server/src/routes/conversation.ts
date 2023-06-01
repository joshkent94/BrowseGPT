import { procedure } from '@utils/trpc'
import z from 'zod'
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from 'openai'

const conversation = procedure
    .input(z.object({ firstName: z.string(), apiKey: z.string(), conversation: z.array(z.object({ role: z.enum([ChatCompletionRequestMessageRoleEnum.Assistant, ChatCompletionRequestMessageRoleEnum.User]), content: z.string() })) }))
    .query(async (opts) => {
        // const name = opts.input.firstName
        // const apiKey = opts.input.apiKey
        // const configuration = new Configuration({
        //     apiKey,
        // })
        // const openAI = new OpenAIApi(configuration)
        // const response = await openAI.createChatCompletion({
        //     model: 'gpt-3.5-turbo',
        //     messages: [
        //         {
        //             role: 'system',
        //             content: `You are an AI assistant that aids users as they browse the web, called BrowseGPT. You are helpful, creative, clever, and friendly. You are helping ${name}. Introduce yourself in one sentence`,
        //         },
        //         ...opts.input.conversation
        //     ],
        // })
        // return response.data
        return { // ! Comment this out and uncomment the above to use OpenAI
            choices: [{
                message: {
                    role: 'assistant',
                    content: 'Hi Josh!'
                }
            }]
        }
    })

export { conversation }
