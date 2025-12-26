import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })
}

export const db = globalThis.prisma ?? prismaClientSingleton()

// Cache in both dev and production to prevent connection leaks
globalThis.prisma = db