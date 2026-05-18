import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI学习资源导航',
  description: '汇聚全网精选的AI学习资料，助你快速掌握人工智能技术',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
