import { useState, useEffect } from 'react'
import type { Category } from '@prisma/client'

interface CategoryFormProps {
  categories: Category[]
  category?: Category | null
  onSubmit: (data: { name: string; parentId: string | null; order: number }) => void
  onCancel: () => void
}

function buildCategoryOptions(categories: Category[], parentId: string | null = null, level = 0, excludeId?: string): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = []
  const filtered = categories.filter(c => c.parentId === parentId && c.id !== excludeId)
  
  for (const cat of filtered) {
    const prefix = '──'.repeat(level)
    options.push({ value: cat.id, label: `${prefix} ${cat.name}` })
    options.push(...buildCategoryOptions(categories, cat.id, level + 1, excludeId))
  }
  
  return options
}

export default function CategoryForm({ categories, category, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    order: 0,
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        parentId: category.parentId || '',
        order: category.order,
      })
    }
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: formData.name,
      parentId: formData.parentId || null,
      order: Number(formData.order),
    })
  }

  const categoryOptions = buildCategoryOptions(categories, null, 0, category?.id)

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
        <label className="block text-sm font-medium text-gray-700 mb-1">上级分类</label>
        <select
          value={formData.parentId}
          onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">无（顶级分类）</option>
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
        <input
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {category ? '更新分类' : '添加分类'}
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
