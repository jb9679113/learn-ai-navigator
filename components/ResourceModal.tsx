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
  BEGINNER: 'bg-green-100 text-green-700',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-700',
  ADVANCED: 'bg-red-100 text-red-700',
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{resource.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}>
              {difficultyLabels[difficulty]}
            </span>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {resource.category?.name || '未分类'}
            </span>
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {sourceTypeLabels[sourceType]}
            </span>
          </div>
          
          {resource.description && (
            <p className="text-gray-500 mb-4 leading-relaxed">{resource.description}</p>
          )}
          
          <div className="mb-4">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔗 访问链接
            </a>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-2 mb-5">
            <span className="text-gray-400 text-sm">评分:</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${i < resource.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                >
                  ★
                </span>
              ))}
              <span className="text-gray-400 text-xs ml-1">{resource.rating}/5</span>
            </div>
          </div>
          
          {isAdmin && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">我的笔记</h3>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
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
                  <p className="flex-1 text-gray-500 text-sm min-h-[50px] bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
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
    </div>
  )
}
