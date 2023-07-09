import { TRPCError } from '@trpc/server'
import { procedure } from '@utils/trpc'
import z from 'zod'

const signUp = procedure
    .input(
        z.object({
            id: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
            latitude: z.number().nullable(),
            longitude: z.number().nullable(),
        })
    )
    .mutation(async ({ input, ctx }): Promise<User> => {
        const { prisma, session } = ctx
        const { id, firstName, lastName, email, latitude, longitude } = input

        const existingUser = await prisma.user.findUnique({
            where: {
                id,
            },
        })

        if (existingUser) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'User already exists',
            })
        }

        const newUser = await prisma.user.create({
            data: {
                id,
                firstName,
                lastName,
                email,
                latitude,
                longitude,
            },
        })

        if (!newUser) {
            throw new TRPCError({
                code: 'UNPROCESSABLE_CONTENT',
                message: 'User creation failed',
            })
        }

        session.userId = newUser.id
        return newUser
    })

export { signUp }
