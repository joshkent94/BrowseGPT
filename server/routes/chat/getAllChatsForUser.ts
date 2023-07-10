import { hasValidSessionProcedure } from '@utils/middleware/hasValidSession'

const getAllChatsForUser = hasValidSessionProcedure.query(
    async ({ ctx }): Promise<Chats> => {
        const { prisma, user } = ctx
        const { id: userId } = user

        const userChats = await prisma.chat.findMany({
            where: {
                userId,
            },
        })

        const userChatsWithMessages = await Promise.all(
            userChats.map(async (chat) => {
                const messages = await prisma.message.findMany({
                    where: {
                        chatId: chat.id,
                        role: { in: ['user', 'assistant'] },
                    },
                })

                return {
                    ...chat,
                    messages: messages.sort((a, b) => {
                        return new Date(a.createdAt) > new Date(b.createdAt)
                            ? 1
                            : -1
                    }),
                }
            })
        )

        return userChatsWithMessages
    }
)

export { getAllChatsForUser }
