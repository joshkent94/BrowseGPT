import { PrismaClient } from '@prisma/client'
import { initTRPC, inferAsyncReturnType } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'

export const createContext = async ({
    req,
    res,
}: CreateExpressContextOptions) => {
    const session = req.session
    const url =
        process.env.NODE_ENV ===
        'production' ? `${process.env.DATABASE_URL}?schema=public&sslmode=require` : process.env.DATABASE_URL
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url,
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
