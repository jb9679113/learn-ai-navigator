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

export default function ResourceCard({ resource, onClick }: ResourceCardProps) {
  const tags = typeof resource.tags === 'string' ? JSON.parse(resource.tags) : resource.tags
  const difficulty = resource.difficulty as Difficulty
  const sourceType = resource.sourceType as SourceType

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
          {resource.name}
        </h3>
        <span className="text-lg">{sourceTypeIcons[sourceType]}</span>
      </div>
      
      {resource.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {resource.description}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.slice(0, 3).map((tag: string) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">
            +{tags.length - 3}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${difficultyColors[difficulty]}`}>
          {difficultyLabels[difficulty]}
        </span>
        <div className="flex items-center gap-1 text-yellow-500">
          {'★'.repeat(Math.min(resource.rating, 5))}
          <span className="text-gray-400 text-xs ml-1">{resource.rating}</span>
        </div>
      </div>
    </div>
  )
}
