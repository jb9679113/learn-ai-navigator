import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return Response.json({ error: '邮箱和密码不能为空' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return Response.json({ error: '该邮箱已被注册' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER'
      }
    })

    return Response.json({ 
      id: user.id,
      email: user.email,
      role: user.role 
    }, { status: 201 })
  } catch (error) {
    console.error('注册失败:', error)
    return Response.json({ error: '注册失败' }, { status: 500 })
  }
}
