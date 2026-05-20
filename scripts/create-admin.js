const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function createAdmin() {
  const email = 'admin@example.com'
  const password = 'admin123456'
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    
    if (existingUser) {
      console.log('管理员账号已存在')
      process.exit(0)
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    
    console.log('管理员账号创建成功！')
    console.log(`邮箱: ${user.email}`)
    console.log(`密码: ${password}`)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('创建管理员账号失败:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

createAdmin()
