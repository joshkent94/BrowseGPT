import { initTRPC, inferAsyncReturnType } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { prisma } from '@utils/misc/prisma'

export const createContext = async ({
    req,
    res,
}: CreateExpressContextOptions) => {
    const session = req.session

    return { prisma, session, req, res }
}
type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const procedure = t.procedure
export const middleware = t.middleware
