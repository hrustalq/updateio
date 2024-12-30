import { PrismaClient } from './generated/client'

export * from './generated/client'

let prismaClient: PrismaClient | undefined

export function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient()
  }
  return prismaClient
}

export function clearPrismaClient(): void {
  prismaClient = undefined
} 
