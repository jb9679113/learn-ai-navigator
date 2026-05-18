type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
type SourceType = 'GITHUB' | 'WEBSITE' | 'DOCUMENT' | 'OTHER'

interface SearchFilterProps {
  search: string
  onSearchChange: (value: string) => void
  difficulty: Difficulty | null
  onDifficultyChange: (value: Difficulty | null) => void
  sourceType: SourceType | null
  onSourceTypeChange: (value: SourceType | null) => void
  availableTags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
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

export default function SearchFilter({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  sourceType,
  onSourceTypeChange,
  availableTags,
  selectedTags,
  onTagToggle,
}: SearchFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="搜索资源名称、描述..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={difficulty || ''}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty || null)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">难度</option>
            {difficulties.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          
          <select
            value={sourceType || ''}
            onChange={(e) => onSourceTypeChange(e.target.value as SourceType || null)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">来源类型</option>
            {sourceTypes.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {availableTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
