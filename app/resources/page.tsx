'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import CategoryTree from '@/components/CategoryTree'
import SearchFilter from '@/components/SearchFilter'
import ResourceCard from '@/components/ResourceCard'
import ResourceModal from '@/components/ResourceModal'
import type { Resource, Category } from '@prisma/client'

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
type SourceType = 'GITHUB' | 'WEBSITE' | 'DOCUMENT' | 'OTHER'

interface ResourceWithCategory extends Resource {
  category?: { name: string }
}

export default function ResourcesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [resources, setResources] = useState<ResourceWithCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedResource, setSelectedResource] = useState<ResourceWithCategory | null>(null)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [sourceType, setSourceType] = useState<SourceType | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  const availableTags = [...new Set(resources.flatMap(r => r.tags))]

  useEffect(() => {
    fetchCategories()
    fetchResources()
    setIsAdmin(localStorage.getItem('admin') === 'true')
  }, [])

  useEffect(() => {
    fetchResources()
  }, [selectedCategoryId, search, difficulty, sourceType, selectedTags])

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
  }

  const fetchResources = async () => {
    const params = new URLSearchParams()
    if (selectedCategoryId) params.set('categoryId', selectedCategoryId)
    if (search) params.set('search', search)
    if (difficulty) params.set('difficulty', difficulty)
    if (sourceType) params.set('sourceType', sourceType)
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))

    const res = await fetch(`/api/resources?${params}`)
    const data = await res.json()
    setResources(data)
  }

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
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
      <Header isAdmin={isAdmin} onLogout={() => { localStorage.removeItem('admin'); setIsAdmin(false) }} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">分类导航</h3>
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
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
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
                <div className="col-span-full text-center py-16 text-gray-400">
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
          isAdmin={isAdmin}
          onClose={() => setSelectedResource(null)}
          onUpdateNotes={handleUpdateNotes}
        />
      )}
    </div>
  )
}
