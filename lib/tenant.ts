import { cookies } from 'next/headers'
import prisma from './prisma'
import { getCurrentUser } from './auth'

// Tenant context extraction and validation
// Ensures no cross-tenant access (core multi-tenant requirement)

export interface TenantContext {
  tenantId: string
  branchId?: string
  userId: string
  role: string
}

export async function getTenantContext(): Promise<TenantContext | null> {
  const user = await getCurrentUser()
  if (!user) return null

  return {
    tenantId: user.tenantId,
    branchId: user.branchId || undefined,
    userId: user.id,
    role: user.role,
  }
}

// Enforce tenant isolation in queries
// Usage: const context = await getTenantContext(); if (!context) throw new Error('UNAUTHENTICATED')
export function enforceTenant<T>(
  context: TenantContext | null,
  query: (where: any) => Promise<T>
): Promise<T> {
  if (!context) {
    throw new Error('TENANT_SCOPE_REQUIRED: No authenticated tenant context')
  }

  // All queries MUST include tenantId filter
  return query({ tenantId: context.tenantId })
}

// Helper for branch-scoped operations
export function enforceBranch<T>(
  context: TenantContext | null,
  branchId: string | undefined,
  query: (where: any) => Promise<T>
): Promise<T> {
  if (!context) throw new Error('TENANT_SCOPE_REQUIRED')
  if (branchId && context.branchId && context.branchId !== branchId && context.role !== 'SUPER_ADMIN') {
    throw new Error('CROSS_BRANCH_ACCESS_DENIED')
  }
  return query({ tenantId: context.tenantId, ...(branchId && { branchId }) })
}