import { PrismaClient } from '@prisma/client'
import { initTRPC, inferAsyncReturnType } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { connectionString } from '@utils/middleware/sessionConfig'

export const createContext = async ({
    req,
    res,
}: CreateExpressContextOptions) => {
    const session = req.session
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: connectionString,
            },
        },
    })

    return { prisma, session, req, res }
}
type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const procedure = t.procedure
export const middleware = t.middleware
