import { TRPCError } from '@trpc/server'
import { procedure } from '@utils/trpc'
import z from 'zod'

const login = procedure
    .input(
        z.object({
            id: z.string(),
            email: z.string(),
            latitude: z.number().nullable(),
            longitude: z.number().nullable(),
        })
    )
    .mutation(async ({ input, ctx }): Promise<User> => {
        const { prisma, session } = ctx
        const { id, email, latitude, longitude } = input

        const existingUser = await prisma.user.findUnique({
            where: {
                id,
            },
        })

        if (!existingUser) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'User does not exist',
            })
        }

        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                email,
                latitude,
                longitude,
            },
        })

        if (!updatedUser) {
            throw new TRPCError({
                code: 'UNPROCESSABLE_CONTENT',
                message: 'Login failed',
            })
        }

        session.userId = updatedUser.id
        return updatedUser
    })

export { login }
