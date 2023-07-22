import session, { CookieOptions } from 'express-session'
import connect from 'connect-pg-simple'
import { Pool } from 'pg'
import 'dotenv/config'

export const isProduction = process.env.NODE_ENV === 'production'
export const connectionString = isProduction
    ? `${process.env.DATABASE_URL}?schema=public&sslmode=require`
    : process.env.DATABASE_URL

const cookie: CookieOptions = {
    ...(process.env.NODE_ENV === 'production' && {
        secure: true,
        sameSite: 'none',
    }),
    httpOnly: false,
    maxAge: 86400000,
}

const pgSession = connect(session)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
})

export const sessionConfig = {
    store: new pgSession({ createTableIfMissing: true, pool }),
    secret: process.env.SESSION_SECRET as string,
    saveUninitialized: false,
    resave: false,
    name: 'browse-gpt',
    cookie,
}
