import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-7">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-blue-600">持续更新中</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-5">
            发现优质 AI 学习资源
          </h1>
          
          <p className="text-base lg:text-lg text-gray-500 mb-8 leading-relaxed">
            汇聚全网精选的 AI 学习资料，助你快速掌握人工智能技术
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/resources"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              浏览资源
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center px-7 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              了解更多
            </Link>
          </div>
          
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">50+</div>
              <div className="text-xs text-gray-400">精选资源</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">10+</div>
              <div className="text-xs text-gray-400">分类体系</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">24/7</div>
              <div className="text-xs text-gray-400">持续更新</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
