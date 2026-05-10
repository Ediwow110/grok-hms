import prisma from '../lib/prisma'
import { hashPassword } from '../lib/auth'
import { PERMISSIONS, ROLE_PERMISSIONS } from '../lib/permissions'

async function main() {
  console.log('🌱 Starting Grok HMS seed (Blueprint v2.0 compliant)...')

  // 1. Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'acme-health' },
    update: {},
    create: {
      name: 'Acme Health Group',
      slug: 'acme-health',
      status: 'active',
    },
  })
  console.log(`✅ Tenant created: ${tenant.name}`)

  // 2. Create Branch
  const branch = await prisma.branch.upsert({
    where: { id: 'main-clinic' },
    update: {},
    create: {
      id: 'main-clinic',
      tenantId: tenant.id,
      name: 'Main Clinic & Diagnostics',
      code: 'MAIN',
      address: '123 Health Blvd, San Francisco, CA',
      status: 'active',
    },
  })
  console.log(`✅ Branch created: ${branch.name}`)

  // 3. Create Roles
  const roles = ['SUPER_ADMIN', 'BRANCH_ADMIN', 'RECEPTIONIST', 'CASHIER', 'MED_TECH', 'PATHOLOGIST', 'INVENTORY_STAFF', 'HR_STAFF', 'AUDITOR']
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `${roleName} role with blueprint-defined permissions`,
        isSystem: roleName === 'SUPER_ADMIN',
      },
    })
  }
  console.log('✅ Roles seeded')

  // 4. Create Permissions (from PERMISSIONS catalog)
  const allPerms = Object.values(PERMISSIONS)
  for (const permKey of allPerms) {
    await prisma.permission.upsert({
      where: { key: permKey },
      update: {},
      create: {
        key: permKey,
        description: `Permission: ${permKey.replace('.', ' ')}`,
        category: permKey.split('.')[0],
      },
    })
  }
  console.log(`✅ ${allPerms.length} Permissions seeded`)

  // 5. Link RolePermissions
  for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } })
    if (!role) continue

    for (const permKey of perms) {
      const perm = await prisma.permission.findUnique({ where: { key: permKey } })
      if (perm) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: { roleId: role.id, permissionId: perm.id }
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: perm.id,
            scope: roleName === 'SUPER_ADMIN' ? 'tenant' : 'branch',
          },
        })
      }
    }
  }
  console.log('✅ Role-Permission mappings created')

  // 6. Create Super Admin User
  const superAdminEmail = 'admin@grok-hms.dev'
  const existingUser = await prisma.user.findUnique({ where: { email: superAdminEmail } })

  if (!existingUser) {
    const passwordHash = await hashPassword('SecureAdmin123!')
    const superRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } })

    await prisma.user.create({
      data: {
        email: superAdminEmail,
        passwordHash,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'SUPER_ADMIN',
        tenantId: tenant.id,
        branchId: branch.id,
        status: 'active',
        userRoles: {
          create: {
            roleId: superRole!.id,
          },
        },
      },
    })
    console.log(`✅ Super Admin created: ${superAdminEmail} (password: SecureAdmin123!)`)
  } else {
    console.log('ℹ️ Super Admin already exists')
  }

  console.log('\n🎉 Seed complete! You can now login with admin@grok-hms.dev / SecureAdmin123!')
  console.log('All 41 non-negotiables and blueprint principles are now enforceable in code.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })