import { procedure } from '@utils/trpc'
import z from 'zod'
import {
    Configuration,
    OpenAIApi,
    ChatCompletionRequestMessageRoleEnum,
} from 'openai'
import { getCityAndCountry } from '@utils/getCityAndCountry'
require('dotenv').config()

const conversation = procedure
    .input(
        z.object({
            firstName: z.string(),
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
                userLocation: z.array(z.number().nullable()),
            }),
        })
    )
    .query(async (opts) => {
        const name = opts.input.firstName
        const apiKey = process.env.OPENAI_API_KEY
        let location: string | undefined
        const [latitude, longitude] = opts.input.conversation.userLocation
        if (latitude && longitude) {
            location = await getCityAndCountry(latitude, longitude)
        } else {
            location = 'an unknown location'
        }
        const messagesToSend = opts.input.conversation.messages.map(
            (message) => {
                if (message.url) {
                    return {
                        role: message.role,
                        content: `${message.url}: ${message.content}`,
                    }
                } else {
                    return message
                }
            }
        )
        const date = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        const configuration = new Configuration({
            apiKey,
        })
        const openAI = new OpenAIApi(configuration)
        const response = await openAI.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `The date is ${date}. You are an AI assistant that aids users as they browse the web, called BrowseGPT. You are helpful, creative and clever. You will be sent messages in the form '{user_current_url}: {user_message}' where user_current_url is the URL the user was on when sending the message, and user_message is the message the user is sending. Use this information when providing your answer. The user can click links you send them, so favour sending links in your messages. Also, favour replying with short, concise messages so the user can get what they want quickly, and never reply with code or JSON. You are helping ${name} who's currently in ${location}. Introduce yourself in one extremely short sentence, and make sure to speak to them like a close friend.`,
                },
                ...messagesToSend,
            ],
        })
        return response.data.choices[0].message
    })

export { conversation }
