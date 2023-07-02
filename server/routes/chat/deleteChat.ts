import { hasValidSessionProcedure } from '@utils/middleware/hasValidSession'
import z from 'zod'

const deleteChat = hasValidSessionProcedure
    .input(
        z.object({
            chatId: z.string(),
        })
    )
    .mutation(async ({ input, ctx }): Promise<string> => {
        const { chatId } = input
        const { prisma } = ctx

        await prisma.chat.delete({
            where: {
                id: chatId,
            },
        })

        return chatId
    })

export { deleteChat }
