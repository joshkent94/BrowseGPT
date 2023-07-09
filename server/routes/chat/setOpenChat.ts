import { hasValidSessionProcedure } from '@utils/middleware/hasValidSession'
import z from 'zod'

const setOpenChat = hasValidSessionProcedure
    .input(
        z.object({
            chatId: z.string(),
        })
    )
    .mutation(async ({ ctx, input }): Promise<Chat> => {
        const { prisma, user } = ctx
        const { chatId } = input

        // set all existing chats to not open first
        await prisma.chat.updateMany({
            where: {
                userId: user.id,
            },
            data: {
                isOpen: false,
            },
        })

        const updatedChat = await prisma.chat.update({
            where: {
                id: chatId,
            },
            data: {
                isOpen: true,
            },
        })

        const messages = await prisma.message.findMany({
            where: {
                chatId: updatedChat.id,
                role: { in: ['user', 'assistant'] },
            },
        })

        return {
            ...updatedChat,
            messages: messages.sort((a, b) => {
                return new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1
            }),
        }
    })

export { setOpenChat }
