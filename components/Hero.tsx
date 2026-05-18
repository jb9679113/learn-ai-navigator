import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            发现优质 AI 学习资源
          </h1>
          <p className="text-lg lg:text-xl text-blue-100 mb-8">
            汇聚全网精选的 AI 学习资料，助你快速掌握人工智能技术
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resources"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              浏览资源
            </Link>
            <Link
              href="/resources"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              了解更多
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
