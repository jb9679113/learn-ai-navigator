import Link from 'next/link'

interface HeaderProps {
  isAdmin: boolean
  onLogout?: () => void
}

export default function Header({ isAdmin, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">AI</span>
            </div>
            <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              AI学习资源导航
            </Link>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link
              href="/resources"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              资源列表
            </Link>
            {isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  后台管理
                </Link>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  退出
                </button>
              </>
            ) : (
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                管理员登录
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
