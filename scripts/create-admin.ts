import { hashPassword } from 'better-auth/crypto'
import { eq } from 'drizzle-orm'

import { db } from '../src/db/drizzle'
import { account as accountTable, user as userTable } from '../src/db/schema'

async function createAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD env vars must be set.')
    process.exit(1)
  }

  const existing = await db().query.user.findFirst({
    where: eq(userTable.email, adminEmail),
  })
  if (existing) {
    console.log('Admin user already exists.')
    return
  }

  const [usr] = await db()
    .insert(userTable)
    .values({
      id: 'dror',
      email: adminEmail,
      name: 'dror',
      role: 'admin',
    })
    .returning()

  console.log('created user', JSON.stringify(usr, null, 2))

  const [acnt] = await db()
    .insert(accountTable)
    .values({
      id: 'dror',
      userId: usr.id,
      accountId: adminEmail,
      providerId: 'credential',
      password: await hashPassword(adminPassword),
    })
    .returning()

  console.log('created account', JSON.stringify(acnt, null, 2))
}

try {
  await createAdminUser()
} catch (error) {
  console.error('Error when creating admin user:', error)
}
