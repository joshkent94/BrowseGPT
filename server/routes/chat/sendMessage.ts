import z from 'zod'
import OpenAI from 'openai'
import { hasValidSessionProcedure } from '@utils/middleware/hasValidSession'
import { TRPCError } from '@trpc/server'
import 'dotenv/config'
import { generateInitialPrompt } from '@utils/misc/initialPrompt'
import { GPT_MODEL } from '@utils/constants'

const ChatCompletionRequestMessageRoleEnum = z.enum([
    'assistant',
    'user',
    'system',
])

const sendMessage = hasValidSessionProcedure
    .input(
        z.object({
            chatId: z.string(),
            message: z
                .object({
                    role: ChatCompletionRequestMessageRoleEnum,
                    content: z.string(),
                    url: z.string().optional(),
                    isCommand: z.boolean().optional(),
                })
                .optional(),
            userLocation: z.array(z.number().nullable()).optional(),
        })
    )
    .mutation(async ({ input, ctx }): Promise<Message> => {
        const { message, userLocation, chatId } = input
        const { prisma } = ctx
        const { firstName } = ctx.user
        const [latitude, longitude] = userLocation ?? [null, null]
        const apiKey = process.env.OPENAI_API_KEY
        const openai = new OpenAI({
            apiKey,
        })

        // if no message, the chat has just started so send the system prompt
        if (!message) {
            const initialPrompt = await generateInitialPrompt(
                firstName || 'someone',
                latitude,
                longitude
            )

            await prisma.message.create({
                data: {
                    role: 'system',
                    content: initialPrompt,
                    chatId,
                },
            })

            const gptResponse = await openai.chat.completions.create({
                model: GPT_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: initialPrompt,
                    },
                ],
            })

            if (!gptResponse?.choices[0]?.message?.content) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Error connecting to GPT',
                })
            }

            await prisma.message.create({
                data: {
                    role: 'assistant',
                    content: gptResponse.choices[0].message.content,
                    chatId,
                },
            })

            return gptResponse.choices[0].message as Message
        }

        // else, store new message, then get all messages and send them to GPT
        await prisma.message.create({
            data: {
                role: message.role,
                content: message.content,
                isCommand: message.isCommand,
                chatId,
                url: message.url,
            },
        })

        const storedMessages = await prisma.message.findMany({
            where: {
                chatId,
            },
        })

        const messagesToSend = storedMessages
            .sort((a, b) => {
                return new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1
            })
            .map((message) => {
                const messageContent = message.url
                    ? `${message.url}: ${message.content}`
                    : message.content

                return {
                    role: message.role,
                    content: messageContent,
                }
            })

        const gptResponse = await openai.chat.completions.create({
            model: GPT_MODEL,
            messages: messagesToSend,
        })

        if (!gptResponse?.choices[0]?.message?.content) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error connecting to GPT',
            })
        }

        await prisma.message.create({
            data: {
                role: 'assistant',
                content: gptResponse.choices[0].message.content,
                chatId,
            },
        })

        return gptResponse.choices[0].message as Message
    })

export { sendMessage }
