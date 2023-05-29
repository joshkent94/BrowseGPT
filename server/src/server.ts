import express from 'express'
import { greeting } from '@routes/greeting'
import { router, createContext } from './utils/trpc'
import * as trpcExpress from '@trpc/server/adapters/express'
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

const appRouter = router({
    greeting,
})

export type AppRouter = typeof appRouter

app.use(
    '/api',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
)

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})
