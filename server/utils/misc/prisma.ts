import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

let prisma: PrismaClient

// only create the prisma client once
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }
    prisma = global.prisma
}

export { prisma }
