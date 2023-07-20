import session, { CookieOptions } from 'express-session'
import connect from 'connect-pg-simple'

const cookie: CookieOptions = {
    ...(process.env.NODE_ENV === 'production' && { secure: true, sameSite: 'none' }),
    httpOnly: false,
    maxAge: 86400000,
}

export const sessionConfig = {
    store: new (connect(session))({ createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET as string,
    saveUninitialized: false,
    resave: false,
    name: 'browse-gpt',
    cookie,
}
