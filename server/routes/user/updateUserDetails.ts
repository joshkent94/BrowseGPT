import { TRPCError } from '@trpc/server'
import { hasValidSessionProcedure } from '@utils/middleware/hasValidSession'
import z from 'zod'

const updateUserDetails = hasValidSessionProcedure
    .input(
        z.object({
            firstName: z.string(),
            lastName: z.string(),
            latitude: z.number().nullable(),
            longitude: z.number().nullable(),
        })
    )
    .mutation(async ({ input, ctx }): Promise<User> => {
        const { prisma, user } = ctx
        const { firstName, lastName, latitude, longitude } = input

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                ...user,
                firstName,
                lastName,
                latitude,
                longitude,
            },
        })

        if (!updatedUser) {
            throw new TRPCError({
                code: 'UNPROCESSABLE_CONTENT',
                message: 'User update failed',
            })
        }

        return updatedUser
    })

export { updateUserDetails }
