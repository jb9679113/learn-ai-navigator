import { useState } from 'react'

interface Category {
  id: string
  name: string
  parentId: string | null
  children?: Category[]
}

interface CategoryTreeProps {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  showAll?: boolean
}

export default function CategoryTree({ categories, selectedId, onSelect, showAll = false }: CategoryTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const safeCategories: Category[] = Array.isArray(categories) ? categories : []

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const renderTree = (items: Category[], depth = 0) => {
    if (!Array.isArray(items)) return null
    return items.map((item) => (
      <li key={item.id} className="mb-1">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
            selectedId === item.id
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 font-medium border border-purple-500/30'
              : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-300'
          }`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          onClick={() => onSelect(item.id)}
        >
          {item.children && item.children.length > 0 && (
            <span
              className="expand-icon text-gray-500 hover:text-gray-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(item.id)
              }}
            >
              {expandedIds.has(item.id) ? '▼' : '▶'}
            </span>
          )}
          {(!item.children || item.children.length === 0) && <span className="w-4" />}
          <span className="truncate">{item.name}</span>
        </div>
        {item.children &&
          item.children.length > 0 &&
          expandedIds.has(item.id) &&
          renderTree(item.children, depth + 1)}
      </li>
    ))
  }

  return (
    <div className="category-tree">
      {showAll && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
            selectedId === null ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 font-medium border border-purple-500/30' : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => onSelect(null)}
        >
          <span className="w-4" />
          <span>全部资源</span>
        </div>
      )}
      <ul className="mt-2">{renderTree(safeCategories)}</ul>
    </div>
  )
}
