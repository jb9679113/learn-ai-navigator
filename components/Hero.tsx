import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export default function Hero() {
  const { isDark } = useTheme()

  return (
    <section className="relative overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? 'hero-gradient-dark' : 'hero-gradient-light'}`} />
      <div className={`absolute inset-0 ${isDark ? 'hero-radial-dark' : 'hero-radial-light'}`} />
      <div className={`absolute inset-0 ${isDark ? 'hero-radial-bottom-dark' : 'hero-radial-bottom-light'}`} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 backdrop-blur-sm border border-color rounded-full mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-secondary">持续更新中</span>
          </div>
          
          <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${isDark ? 'text-gradient-dark' : 'text-gradient-light'}`}>
            发现优质 AI 学习资源
          </h1>
          
          <p className="text-lg lg:text-xl text-secondary mb-8 leading-relaxed">
            汇聚全网精选的 AI 学习资料，助你快速掌握人工智能技术
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resources"
              className="group relative px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              <span className="relative z-10 flex items-center gap-2">
                浏览资源
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/resources"
              className="px-8 py-3 bg-secondary/50 backdrop-blur-sm border border-color text-secondary font-semibold rounded-xl hover:bg-secondary hover:border-color transition-all duration-300"
            >
              了解更多
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">50+</div>
              <div className="text-sm text-muted">精选资源</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">10+</div>
              <div className="text-sm text-muted">分类体系</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted">持续更新</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
