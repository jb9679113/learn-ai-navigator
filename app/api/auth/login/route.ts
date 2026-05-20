import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return Response.json({ error: '邮箱和密码不能为空' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return Response.json({ error: '邮箱或密码错误' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return Response.json({ error: '邮箱或密码错误' }, { status: 401 })
    }

    return Response.json({ 
      id: user.id,
      email: user.email,
      role: user.role 
    }, { status: 200 })
  } catch (error) {
    console.error('登录失败:', error)
    return Response.json({ error: '登录失败' }, { status: 500 })
  }
}
