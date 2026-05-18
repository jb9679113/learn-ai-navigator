'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ResourceCard from '@/components/ResourceCard'
import ResourceModal from '@/components/ResourceModal'
import type { Resource, Category } from '@prisma/client'

interface ResourceWithCategory extends Resource {
  category?: { name: string }
}

export default function HomePage() {
  const [selectedResource, setSelectedResource] = useState<ResourceWithCategory | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [latestResources, setLatestResources] = useState<ResourceWithCategory[]>([])
  const [topResources, setTopResources] = useState<ResourceWithCategory[]>([])

  useEffect(() => {
    setIsAdmin(localStorage.getItem('admin') === 'true')
    fetchCategories()
    fetchLatestResources()
    fetchTopResources()
  }, [])

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
  }

  const fetchLatestResources = async () => {
    const res = await fetch('/api/resources')
    const data = await res.json()
    setLatestResources(data.slice(0, 6))
  }

  const fetchTopResources = async () => {
    const res = await fetch('/api/resources')
    const data = await res.json()
    const sorted = data.sort((a: Resource, b: Resource) => b.rating - a.rating).slice(0, 3)
    setTopResources(sorted)
  }

  const handleLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('admin')
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
      <Header isAdmin={isAdmin} onLogout={handleLogout} />
      
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">热门分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.length > 0 ? (
              categories.slice(0, 5).map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="text-lg font-semibold text-gray-800">{category.name}</div>
                  <div className="text-sm text-gray-500">点击浏览</div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400">加载中...</div>
            )}
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">最新添加</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestResources.length > 0 ? (
              latestResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onClick={() => setSelectedResource(resource)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400">加载中...</div>
            )}
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">推荐资源</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topResources.length > 0 ? (
              topResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onClick={() => setSelectedResource(resource)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400">加载中...</div>
            )}
          </div>
        </section>
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
