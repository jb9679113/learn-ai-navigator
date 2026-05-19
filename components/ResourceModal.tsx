import { useState } from 'react'
import type { Resource } from '@prisma/client'

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
type SourceType = 'GITHUB' | 'WEBSITE' | 'DOCUMENT' | 'OTHER'

interface ResourceModalProps {
  resource: Resource & { category?: { name: string } }
  isAdmin: boolean
  onClose: () => void
  onUpdateNotes: (notes: string) => void
}

const difficultyColors: Record<Difficulty, string> = {
  BEGINNER: 'bg-green-500/20 text-green-400 border border-green-500/30',
  INTERMEDIATE: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  ADVANCED: 'bg-red-500/20 text-red-400 border border-red-500/30',
}

const difficultyLabels: Record<Difficulty, string> = {
  BEGINNER: '入门',
  INTERMEDIATE: '中级',
  ADVANCED: '高级',
}

const sourceTypeLabels: Record<SourceType, string> = {
  GITHUB: 'GitHub',
  WEBSITE: '网站',
  DOCUMENT: '文档',
  OTHER: '其他',
}

function parseTags(tags: string | string[]): string[] {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  try {
    return JSON.parse(tags)
  } catch {
    return tags.split(',').map(t => t.trim()).filter(t => t)
  }
}

export default function ResourceModal({ resource, isAdmin, onClose, onUpdateNotes }: ResourceModalProps) {
  const [notes, setNotes] = useState(resource.myNotes || '')
  const [isEditing, setIsEditing] = useState(false)

  const tags = parseTags(resource.tags)
  const difficulty = resource.difficulty as Difficulty
  const sourceType = resource.sourceType as SourceType

  const handleSaveNotes = async () => {
    await onUpdateNotes(notes)
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{resource.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${difficultyColors[difficulty]}`}>
              {difficultyLabels[difficulty]}
            </span>
            <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
              {resource.category?.name || '未分类'}
            </span>
            <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30">
              {sourceTypeLabels[sourceType]}
            </span>
          </div>
          
          {resource.description && (
            <p className="text-gray-400 mb-4 leading-relaxed">{resource.description}</p>
          )}
          
          <div className="mb-4">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/20"
            >
              🔗 访问链接
            </a>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-gray-800/50 text-gray-400 text-sm rounded-full border border-gray-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="text-gray-500">评分:</span>
            <div className="flex items-center gap-1 text-yellow-400">
              {'★'.repeat(Math.min(resource.rating, 5))}
              <span className="text-gray-500 text-sm ml-1">{resource.rating}/5</span>
            </div>
          </div>
          
          {isAdmin && (
            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">我的笔记</h3>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-500 resize-none transition-all duration-300"
                    rows={4}
                    placeholder="在这里添加你的笔记..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNotes}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm shadow-lg shadow-purple-500/20"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setNotes(resource.myNotes || '')
                        setIsEditing(false)
                      }}
                      className="px-4 py-2 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 hover:text-gray-300 transition-all duration-300 text-sm border border-gray-700"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <p className="flex-1 text-gray-400 text-sm min-h-[60px] bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 leading-relaxed">
                    {notes || '暂无笔记'}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 hover:text-gray-300 transition-all duration-300 text-sm border border-gray-700"
                  >
                    编辑
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
