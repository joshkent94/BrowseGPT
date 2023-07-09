import { TRPCError } from '@trpc/server'
import { middleware, procedure } from '@utils/trpc'

const hasValidSession = middleware(async ({ ctx, next }) => {
    const sessionId = ctx.session?.id
    const userId = ctx.session?.userId
    const prisma = ctx.prisma

    if (!sessionId || !userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    const session = await prisma.session.findUnique({
        where: {
            sid: sessionId,
        },
    })
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    })

    if (!session || !user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return next({
        ctx: {
            ...ctx,
            user,
        },
    })
})

export const hasValidSessionProcedure = procedure.use(hasValidSession)
