import { useState, useEffect } from 'react'
import type { Resource, Difficulty, SourceType } from '@prisma/client'

interface ResourceFormProps {
  categories: { id: string; name: string; parentId: string | null }[]
  resource?: Resource | null
  onSubmit: (data: Partial<Resource> & { categoryId: string }) => void
  onCancel: () => void
}

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'BEGINNER', label: '入门' },
  { value: 'INTERMEDIATE', label: '中级' },
  { value: 'ADVANCED', label: '高级' },
]

const sourceTypes: { value: SourceType; label: string }[] = [
  { value: 'GITHUB', label: 'GitHub' },
  { value: 'WEBSITE', label: '网站' },
  { value: 'DOCUMENT', label: '文档' },
  { value: 'OTHER', label: '其他' },
]

function buildCategoryOptions(categories: { id: string; name: string; parentId: string | null }[], parentId: string | null = null, level = 0): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = []
  const filtered = categories.filter(c => c.parentId === parentId)
  
  for (const cat of filtered) {
    const prefix = '──'.repeat(level)
    options.push({ value: cat.id, label: `${prefix} ${cat.name}` })
    options.push(...buildCategoryOptions(categories, cat.id, level + 1))
  }
  
  return options
}

export default function ResourceForm({ categories, resource, onSubmit, onCancel }: ResourceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    categoryId: '',
    tags: '',
    difficulty: 'BEGINNER' as Difficulty,
    rating: 0,
    sourceType: 'OTHER' as SourceType,
    myNotes: '',
    isPublished: true,
  })

  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name,
        url: resource.url,
        description: resource.description || '',
        categoryId: resource.categoryId,
        tags: resource.tags.join(','),
        difficulty: resource.difficulty,
        rating: resource.rating,
        sourceType: resource.sourceType,
        myNotes: resource.myNotes || '',
        isPublished: resource.isPublished,
      })
    }
  }, [resource])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      rating: Number(formData.rating),
    })
  }

  const categoryOptions = buildCategoryOptions(categories)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">名称 *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">网址 *</label>
        <input
          type="url"
          required
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
        <select
          required
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">请选择分类</option>
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="标签1, 标签2, 标签3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {difficulties.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">评分 (0-5)</label>
          <input
            type="number"
            min="0"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">来源类型</label>
        <select
          value={formData.sourceType}
          onChange={(e) => setFormData({ ...formData, sourceType: e.target.value as SourceType })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sourceTypes.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">我的笔记</label>
        <textarea
          value={formData.myNotes}
          onChange={(e) => setFormData({ ...formData, myNotes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isPublished}
          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          id="isPublished"
        />
        <label className="ml-2 text-sm text-gray-700" htmlFor="isPublished">发布</label>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {resource ? '更新资源' : '添加资源'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  )
}
