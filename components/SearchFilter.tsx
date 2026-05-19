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
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="搜索资源名称、描述..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 pr-10 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-500 transition-all duration-300"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={difficulty || ''}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty || null)}
            className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-300 cursor-pointer"
          >
            <option value="">难度</option>
            {difficulties.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          
          <select
            value={sourceType || ''}
            onChange={(e) => onSourceTypeChange(e.target.value as SourceType || null)}
            className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-300 cursor-pointer"
          >
            <option value="">来源类型</option>
            {sourceTypes.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {availableTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-purple-500/30 shadow-lg shadow-purple-500/20'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300 border border-gray-600/50'
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
