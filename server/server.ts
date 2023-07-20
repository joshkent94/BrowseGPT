import express from 'express'
import session from 'express-session'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { signUp } from '@routes/user/signUp'
import { login } from '@routes/user/login'
import { logout } from '@routes/user/logout'
import { updateUserDetails } from '@routes/user/updateUserDetails'
import { sendMessage } from '@routes/chat/sendMessage'
import { addChat } from '@routes/chat/addChat'
import { deleteChat } from '@routes/chat/deleteChat'
import { setOpenChat } from '@routes/chat/setOpenChat'
import { getAllChatsForUser } from '@routes/chat/getAllChatsForUser'
import { router, createContext } from '@utils/trpc'
import * as trpcExpress from '@trpc/server/adapters/express'
import { sessionConfig } from '@utils/middleware/sessionConfig'
import 'dotenv/config'

// extend session to have userId property
declare module 'express-session' {
    interface SessionData {
        userId: string
    }
}

const app = express()
const port = process.env.PORT || 3000

const appRouter = router({
    // user
    signUp,
    login,
    logout,
    updateUserDetails,

    // chat
    getAllChatsForUser,
    addChat,
    deleteChat,
    setOpenChat,
    sendMessage,
})
export type AppRouter = typeof appRouter

app.set('trust proxy', true)
app.use(
    cors({
        credentials: true,
        origin: 'chrome-extension://ijdehllahgkhhcoffcohgmbebcchdknb',
    })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session(sessionConfig))
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
