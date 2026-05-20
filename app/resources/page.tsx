'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import CategoryTree from '@/components/CategoryTree'
import SearchFilter from '@/components/SearchFilter'
import ResourceCard from '@/components/ResourceCard'
import ResourceModal from '@/components/ResourceModal'
import type { Resource } from '@prisma/client'

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
type SourceType = 'GITHUB' | 'WEBSITE' | 'DOCUMENT' | 'OTHER'

interface Category {
  id: string
  name: string
  parentId: string | null
  children?: Category[]
}

interface ResourceWithCategory extends Resource {
  category?: { name: string }
}

interface User {
  id: string
  email: string
  role: string
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

export default function ResourcesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [resources, setResources] = useState<ResourceWithCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedResource, setSelectedResource] = useState<ResourceWithCategory | null>(null)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [sourceType, setSourceType] = useState<SourceType | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser))
      }
    } catch (e) {
      // localStorage 在 SSR 中不可用
    }
    fetchCategories()
    fetchResources()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      fetchResources()
    }
  }, [selectedCategoryId, search, difficulty, sourceType, isLoading])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Error fetching categories:', e)
      setCategories([])
    }
  }

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategoryId) params.set('categoryId', selectedCategoryId)
      if (search) params.set('search', search)
      if (difficulty) params.set('difficulty', difficulty)
      if (sourceType) params.set('sourceType', sourceType)

      const res = await fetch(`/api/resources?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setResources(Array.isArray(data) ? data : [])
      setIsLoading(false)
    } catch (e) {
      console.error('Error fetching resources:', e)
      setResources([])
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('user')
  }

  const handleUpdateNotes = async (notes: string) => {
    if (!selectedResource) return
    await fetch(`/api/resources/${selectedResource.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...selectedResource, myNotes: notes }),
    })
    setSelectedResource({ ...selectedResource, myNotes: notes })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isAdmin={currentUser?.role === 'ADMIN'} 
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                分类导航
              </h3>
              <CategoryTree
                categories={categories}
                selectedId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
                showAll={true}
              />
            </div>
          </aside>
          
          <div className="flex-1">
            <SearchFilter
              search={search}
              onSearchChange={setSearch}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              sourceType={sourceType}
              onSourceTypeChange={setSourceType}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.length > 0 ? (
                resources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onClick={() => setSelectedResource(resource)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16 text-gray-500">
                  暂无资源
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          isAdmin={currentUser?.role === 'ADMIN'}
          onClose={() => setSelectedResource(null)}
          onUpdateNotes={handleUpdateNotes}
        />
      )}
    </div>
  )
}
