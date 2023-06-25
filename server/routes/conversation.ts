import { procedure } from '@utils/trpc'
import z from 'zod'
import {
    Configuration,
    OpenAIApi,
    ChatCompletionRequestMessageRoleEnum,
} from 'openai'
import { decryptString } from '@utils/decryptString'

const conversation = procedure
    .input(
        z.object({
            firstName: z.string(),
            apiKey: z.string(),
            salt: z.string(),
            conversation: z.object({
                id: z.string(),
                isOpen: z.boolean(),
                messages: z.array(
                    z.object({
                        role: z.enum([
                            ChatCompletionRequestMessageRoleEnum.Assistant,
                            ChatCompletionRequestMessageRoleEnum.User,
                        ]),
                        content: z.string(),
                        url: z.string().optional(),
                    })
                ),
            }),
        })
    )
    .query(async (opts) => {
        // const name = opts.input.firstName
        // const apiKey = opts.input.apiKey
        // const salt = opts.input.salt
        // const messagesToSend = opts.input.conversation.messages.map(
        //     (message) => {
        //         if (message.url) {
        //             return {
        //                 role: message.role,
        //                 content: `${message.url}: ${message.content}`,
        //             }
        //         } else {
        //             return message
        //         }
        //     }
        // )
        // const decryptedKey = decryptString(apiKey, salt)
        // const configuration = new Configuration({
        //     apiKey: decryptedKey,
        // })
        // const openAI = new OpenAIApi(configuration)
        // const response = await openAI.createChatCompletion({
        //     model: 'gpt-3.5-turbo',
        //     messages: [
        //         {
        //             role: 'system',
        //             content: `You are an AI assistant that aids users as they browse the web, called BrowseGPT. You are helpful, creative, clever, and friendly. You will be sent messages in the form '{user_current_url}: {user_message}' where user_current_url is the URL the user was on when sending the message, and user_message is the message the user is sending. Use this information when providing your answer. The user can click links you send them, so favour sending links in your messages. Also, favour replying with short, concise messages so the user can get what they want quickly. You are helping ${name}. Introduce yourself in one sentence, and make sure to speak to them like a close friend.`,
        //         },
        //         ...messagesToSend,
        //     ],
        // })
        // return response.data.choices[0].message
        // ! Comment this out and uncomment the above to use OpenAI
        return {
            role: 'assistant',
            content: 'Hi Josh!',
        }
    })

export { conversation }
