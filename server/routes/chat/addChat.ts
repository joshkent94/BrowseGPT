import { hasValidSessionProcedure } from '@utils/middleware/hasValidSession'

const addChat = hasValidSessionProcedure.mutation(
    async ({ ctx }): Promise<Chat> => {
        const { prisma, res, user } = ctx

        // set all existing chats to not open first
        await prisma.chat.updateMany({
            where: {
                userId: user.id,
            },
            data: {
                isOpen: false,
            },
        })

        const newChat = await prisma.chat.create({
            data: {
                userId: user.id,
                isOpen: true,
            },
        })

        res.statusCode = 201
        return {
            id: newChat.id,
            isOpen: true,
            messages: [],
        }
    }
)

export { addChat }
