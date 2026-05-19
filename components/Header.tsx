'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  isAdmin: boolean
  onLogout?: () => void
}

export default function Header({ isAdmin, onLogout }: HeaderProps) {
  return (
    <header className="bg-secondary/95 backdrop-blur-xl border-b border-color sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white text-xl font-bold">AI</span>
            </div>
            <Link href="/" className="text-xl font-bold text-primary hover:text-purple-500 transition-colors">
              AI学习资源导航
            </Link>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link
              href="/resources"
              className="px-4 py-2 text-secondary hover:text-primary hover:bg-secondary rounded-lg transition-all duration-300"
            >
              资源列表
            </Link>
            {isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/20"
                >
                  后台管理
                </Link>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-secondary hover:text-red-400 hover:bg-secondary rounded-lg transition-all duration-300"
                >
                  退出
                </button>
              </>
            ) : (
              <Link
                href="/admin"
                className="px-4 py-2 bg-secondary text-secondary font-semibold rounded-lg hover:bg-card hover:text-primary transition-all duration-300"
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
