import { TRPCError } from '@trpc/server'
import { procedure } from '@utils/trpc'
import z from 'zod'

const signUp = procedure
    .input(
        z.object({
            id: z.string(),
            firstName: z.string().nullable(),
            lastName: z.string().nullable(),
            email: z.string().nullable(),
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
        return {
            id: newUser.id,
            email: newUser.email || '',
            firstName: newUser.firstName || '',
            lastName: newUser.lastName || '',
            latitude: newUser.latitude || null,
            longitude: newUser.longitude || null,
        }
    })

export { signUp }
