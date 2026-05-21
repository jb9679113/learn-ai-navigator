import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    await prisma.$executeRaw`DELETE FROM "_prisma_migrations" WHERE migration_name = '20260520040000_init'`

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "User_email_key" UNIQUE ("email")
      )
    `

    return Response.json({ success: true, message: 'Migration cleanup completed' })
  } catch (error) {
    console.error('Migration cleanup failed:', error)
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
