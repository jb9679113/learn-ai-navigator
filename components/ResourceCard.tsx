import type { Resource } from '@prisma/client'

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
type SourceType = 'GITHUB' | 'WEBSITE' | 'DOCUMENT' | 'OTHER'

interface ResourceCardProps {
  resource: Resource
  onClick: () => void
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

const sourceTypeIcons: Record<SourceType, string> = {
  GITHUB: 'GitHub',
  WEBSITE: '🌐',
  DOCUMENT: '📄',
  OTHER: '📦',
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

export default function ResourceCard({ resource, onClick }: ResourceCardProps) {
  const tags = parseTags(resource.tags)
  const difficulty = resource.difficulty as Difficulty
  const sourceType = resource.sourceType as SourceType

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-gray-800 leading-tight">
          {resource.name}
        </h3>
        <span className="text-sm opacity-60">{sourceTypeIcons[sourceType]}</span>
      </div>
      
      {resource.description && (
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {resource.description}
        </p>
      )}
      
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.slice(0, 3).map((tag: string) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-xs rounded">
            +{tags.length - 3}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${difficultyColors[difficulty]}`}>
          {difficultyLabels[difficulty]}
        </span>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < resource.rating ? 'text-yellow-400' : 'text-gray-200'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-gray-400 text-xs ml-1">{resource.rating}</span>
        </div>
      </div>
    </div>
  )
}
