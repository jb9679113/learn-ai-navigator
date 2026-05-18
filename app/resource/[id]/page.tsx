'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import type { Resource } from '@prisma/client'

interface ResourceWithCategory extends Resource {
  category?: { name: string }
}

const difficultyColors = {
  BEGINNER: 'bg-green-100 text-green-700',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-700',
  ADVANCED: 'bg-red-100 text-red-700',
}

const difficultyLabels = {
  BEGINNER: '入门',
  INTERMEDIATE: '中级',
  ADVANCED: '高级',
}

const sourceTypeLabels: Record<string, string> = {
  GITHUB: 'GitHub',
  WEBSITE: '网站',
  DOCUMENT: '文档',
  OTHER: '其他',
}

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  const [resource, setResource] = useState<ResourceWithCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [notes, setNotes] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchResource()
    setIsAdmin(localStorage.getItem('admin') === 'true')
  }, [params.id])

  const fetchResource = async () => {
    const res = await fetch(`/api/resources/${params.id}`)
    if (res.ok) {
      const data = await res.json()
      setResource(data)
      setNotes(data.myNotes || '')
    }
    setIsLoading(false)
  }

  const handleSaveNotes = async () => {
    if (!resource) return
    await fetch(`/api/resources/${resource.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...resource, myNotes: notes }),
    })
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAdmin={isAdmin} />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center py-16 text-gray-400">加载中...</div>
        </main>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAdmin={isAdmin} />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center py-16 text-gray-400">资源不存在</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={isAdmin} onLogout={() => { localStorage.removeItem('admin'); setIsAdmin(false) }} />
      
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold mb-2">{resource.name}</h1>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20`}>
                {resource.category?.name || '未分类'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20`}>
                {sourceTypeLabels[resource.sourceType]}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[resource.difficulty]}`}>
                {difficultyLabels[resource.difficulty]}
              </span>
              <div className="flex items-center gap-1 text-yellow-500">
                {'★'.repeat(Math.min(resource.rating, 5))}
                <span className="text-gray-400 text-sm ml-1">{resource.rating}/5</span>
              </div>
            </div>
            
            {resource.description && (
              <p className="text-gray-600 mb-6">{resource.description}</p>
            )}
            
            <div className="mb-6">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔗 访问链接
              </a>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            {isAdmin && (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">我的笔记</h3>
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="在这里添加你的笔记..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveNotes}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setNotes(resource.myNotes || '')
                          setIsEditing(false)
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <p className="flex-1 text-gray-600 text-sm min-h-[60px] bg-gray-50 p-3 rounded-lg">
                      {notes || '暂无笔记'}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      编辑
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
