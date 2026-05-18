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
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
            selectedId === item.id
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => onSelect(item.id)}
        >
          {item.children && item.children.length > 0 && (
            <span
              className="expand-icon text-gray-400 hover:text-gray-600"
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
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
            selectedId === null ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => onSelect(null)}
        >
          <span className="w-4" />
          <span>全部资源</span>
        </div>
      )}
      <ul className="mt-1">{renderTree(safeCategories)}</ul>
    </div>
  )
}
