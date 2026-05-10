import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma

// Helper to ensure tenant context in queries (to be used in services)
export function withTenant<T>(tenantId: string, fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
  // For now, simple wrapper; in future can use $transaction with RLS or filters
  return fn(prisma)
}