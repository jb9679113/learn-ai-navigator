'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  isAdmin: boolean
  onLogout?: () => void
}

export default function Header({ isAdmin, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <Link href="/" className="text-lg font-bold text-gray-800 hover:text-blue-500 transition-colors">
              AI学习资源导航
            </Link>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link
              href="/resources"
              className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm"
            >
              资源列表
            </Link>
            {isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className="px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  后台管理
                </Link>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm"
                >
                  退出
                </button>
              </>
            ) : (
              <Link
                href="/admin"
                className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm"
              >
                管理员登录
              </Link>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
