'use client'

import { useState } from 'react'

interface LoginFormProps {
  onLogin: (user: { id: string; email: string; role: string }) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [loginType, setLoginType] = useState<'admin' | 'user'>('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      let response: Response
      let data: any

      if (loginType === 'admin') {
        // 管理员登录 - 使用环境变量密码验证
        response = await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        })
        data = await response.json()
        
        if (!response.ok || !data.success) {
          setError('密码错误，请重试')
          return
        }
        
        // 管理员登录成功
        onLogin({ id: 'admin', email: 'admin@admin.com', role: 'ADMIN' })
      } else {
        // 用户登录/注册 - 使用邮箱+密码
        const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        data = await response.json()
        
        if (!response.ok) {
          setError(data.error || '操作失败')
          return
        }

        onLogin({ id: data.id, email: data.email, role: data.role })
      }
    } catch (err) {
      setError('网络错误')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">AI</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {loginType === 'admin' ? '管理员登录' : (isRegister ? '用户注册' : '用户登录')}
          </h2>
          <p className="text-gray-500 text-sm">
            {loginType === 'admin' 
              ? '请输入管理员密码' 
              : (isRegister ? '创建新账号' : '请输入邮箱和密码')}
          </p>
        </div>
        
        {/* 登录类型切换 */}
        <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => {
              setLoginType('admin')
              setIsRegister(false)
              setError('')
            }}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              loginType === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            管理员
          </button>
          <button
            onClick={() => {
              setLoginType('user')
              setIsRegister(false)
              setError('')
            }}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              loginType === 'user' && !isRegister
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            用户登录
          </button>
          {loginType === 'user' && (
            <button
              onClick={() => {
                setIsRegister(true)
                setError('')
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                isRegister
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              用户注册
            </button>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {loginType === 'user' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入邮箱"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {loginType === 'admin' ? '管理员密码' : '密码'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={loginType === 'admin' ? '请输入管理员密码' : '请输入密码'}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? '处理中...' : (loginType === 'admin' ? '登录' : (isRegister ? '注册' : '登录'))}
          </button>
        </form>
        
        {loginType === 'user' && (
          <p className="mt-4 text-center text-gray-500 text-sm">
            {isRegister ? '已有账号？' : '还没有账号？'}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="ml-1 text-blue-500 hover:text-blue-600 font-medium"
            >
              {isRegister ? '立即登录' : '立即注册'}
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
