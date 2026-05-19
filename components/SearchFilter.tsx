type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
type SourceType = 'GITHUB' | 'WEBSITE' | 'DOCUMENT' | 'OTHER'

interface SearchFilterProps {
  search: string
  onSearchChange: (value: string) => void
  difficulty: Difficulty | null
  onDifficultyChange: (value: Difficulty | null) => void
  sourceType: SourceType | null
  onSourceTypeChange: (value: SourceType | null) => void
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
}: SearchFilterProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="搜索资源名称、描述..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition-all duration-200"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={difficulty || ''}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty || null)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white cursor-pointer transition-all duration-200"
          >
            <option value="">难度</option>
            {difficulties.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          
          <select
            value={sourceType || ''}
            onChange={(e) => onSourceTypeChange(e.target.value as SourceType || null)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white cursor-pointer transition-all duration-200"
          >
            <option value="">来源类型</option>
            {sourceTypes.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
