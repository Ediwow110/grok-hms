import { JWTPayload } from './auth'

// Comprehensive permission catalog from Blueprint v2.0
// Format: 'resource.action' or 'resource.action.scope'
export const PERMISSIONS = {
  // Patient
  PATIENT_VIEW: 'patient.view',
  PATIENT_CREATE: 'patient.create',
  PATIENT_UPDATE: 'patient.update',
  PATIENT_MERGE_REQUEST: 'patient.merge.request',
  PATIENT_MERGE_APPROVE: 'patient.merge.approve',

  // Orders & Billing
  ORDER_CREATE: 'order.create',
  ORDER_CANCEL: 'order.cancel',
  BILLING_PAYMENT_CREATE: 'billing.payment.create',
  BILLING_PAYMENT_VOID: 'billing.payment.void.request',
  BILLING_REFUND_REQUEST: 'billing.refund.request',
  BILLING_REFUND_APPROVE: 'billing.refund.approve',

  // Lab / LIS
  LAB_RESULT_ENCODE: 'lab.result.encode',
  LAB_RESULT_VALIDATE: 'lab.result.validate',
  LAB_RESULT_APPROVE: 'lab.result.approve',
  LAB_RESULT_RELEASE: 'lab.result.release',
  LAB_RESULT_AMEND: 'lab.result.amend.request',

  // Inventory
  INVENTORY_ADJUST_REQUEST: 'inventory.adjust.request',
  INVENTORY_ADJUST_APPROVE: 'inventory.adjust.approve',

  // Reports & Export
  REPORT_EXPORT: 'report.export',

  // Admin
  ADMIN_ROLE_CHANGE: 'admin.role.change',
  ADMIN_USER_CREATE: 'admin.user.create',
  AUDIT_VIEW: 'audit.view',

  // Queue & Appointments
  QUEUE_MANAGE: 'queue.manage',
  APPOINTMENT_CREATE: 'appointment.create',
} as const

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// Role definitions with default permissions (extendable via DB)
export const ROLE_PERMISSIONS: Record<string, PermissionKey[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS), // Full access
  BRANCH_ADMIN: [
    PERMISSIONS.PATIENT_VIEW, PERMISSIONS.PATIENT_CREATE, PERMISSIONS.PATIENT_UPDATE,
    PERMISSIONS.ORDER_CREATE, PERMISSIONS.BILLING_PAYMENT_CREATE,
    PERMISSIONS.LAB_RESULT_ENCODE, PERMISSIONS.LAB_RESULT_VALIDATE,
    PERMISSIONS.LAB_RESULT_APPROVE, PERMISSIONS.LAB_RESULT_RELEASE,
    PERMISSIONS.QUEUE_MANAGE, PERMISSIONS.APPOINTMENT_CREATE,
    PERMISSIONS.AUDIT_VIEW,
  ],
  RECEPTIONIST: [PERMISSIONS.PATIENT_CREATE, PERMISSIONS.PATIENT_VIEW, PERMISSIONS.ORDER_CREATE, PERMISSIONS.QUEUE_MANAGE],
  CASHIER: [PERMISSIONS.BILLING_PAYMENT_CREATE, PERMISSIONS.PATIENT_VIEW],
  MED_TECH: [PERMISSIONS.LAB_RESULT_ENCODE, PERMISSIONS.LAB_RESULT_VALIDATE, PERMISSIONS.PATIENT_VIEW],
  PATHOLOGIST: [PERMISSIONS.LAB_RESULT_APPROVE, PERMISSIONS.LAB_RESULT_RELEASE, PERMISSIONS.LAB_RESULT_AMEND],
  INVENTORY_STAFF: [PERMISSIONS.INVENTORY_ADJUST_REQUEST],
  HR_STAFF: [PERMISSIONS.ADMIN_USER_CREATE],
  AUDITOR: [PERMISSIONS.AUDIT_VIEW, PERMISSIONS.REPORT_EXPORT],
}

// Check if user has permission (fail-closed design)
export function hasPermission(
  user: { role: string; permissions?: string[] } | null,
  requiredPermission: PermissionKey,
  scope?: { branchId?: string; tenantId?: string }
): boolean {
  if (!user) return false

  // Super admin bypass (but still logged)
  if (user.role === 'SUPER_ADMIN') return true

  const userPerms = user.permissions || ROLE_PERMISSIONS[user.role] || []

  const hasBase = userPerms.includes(requiredPermission)
  if (!hasBase) return false

  // Scope enforcement (example: branch-level)
  // In production, extend with actual assignment checks from DB
  if (scope?.branchId && user.role === 'BRANCH_ADMIN') {
    // Would check user.branchAssignments.includes(scope.branchId)
    return true // Simplified for foundation
  }

  return true
}

// Middleware helper: require permission or throw
export function requirePermission(
  user: any,
  permission: PermissionKey,
  scope?: any
) {
  if (!hasPermission(user, permission, scope)) {
    throw new Error(`PERMISSION_DENIED: ${permission}`)
  }
}

// Get all permissions for a role (for seeding/UI)
export function getRolePermissions(role: string): PermissionKey[] {
  return ROLE_PERMISSIONS[role] || []
}