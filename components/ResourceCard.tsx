import type { Resource } from '@prisma/client'

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
type SourceType = 'GITHUB' | 'WEBSITE' | 'DOCUMENT' | 'OTHER'

interface ResourceCardProps {
  resource: Resource
  onClick: () => void
}

const difficultyColors: Record<Difficulty, string> = {
  BEGINNER: 'bg-green-500/20 text-green-400 border border-green-500/30',
  INTERMEDIATE: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  ADVANCED: 'bg-red-500/20 text-red-400 border border-red-500/30',
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
      className="bg-card backdrop-blur-sm border border-color rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer group card-hover"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-primary group-hover:text-purple-500 transition-colors line-clamp-1">
          {resource.name}
        </h3>
        <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">{sourceTypeIcons[sourceType]}</span>
      </div>
      
      {resource.description && (
        <p className="text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 3).map((tag: string) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-secondary text-secondary text-xs rounded-full border border-color"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="px-2.5 py-1 bg-secondary/50 text-muted text-xs rounded-full border border-color/50">
            +{tags.length - 3}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-color">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${difficultyColors[difficulty]}`}>
          {difficultyLabels[difficulty]}
        </span>
        <div className="flex items-center gap-1 text-yellow-400">
          {'★'.repeat(Math.min(resource.rating, 5))}
          <span className="text-muted text-xs ml-1">{resource.rating}</span>
        </div>
      </div>
    </div>
  )
}
