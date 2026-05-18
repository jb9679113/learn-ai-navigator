import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CategoryTree from '@/components/CategoryTree'
import ResourceCard from '@/components/ResourceCard'
import ResourceModal from '@/components/ResourceModal'
import type { Resource, Category } from '@prisma/client'

interface ResourceWithCategory extends Resource {
  category?: { name: string }
}

export default async function HomePage() {
  const [selectedResource, setSelectedResource] = useState<ResourceWithCategory | null>(null)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [latestResources, setLatestResources] = useState<ResourceWithCategory[]>([])
  const [topResources, setTopResources] = useState<ResourceWithCategory[]>([])

  const handleVerifyAdmin = async () => {
    const response = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPassword }),
    })
    const data = await response.json()
    if (data.success) {
      setIsAdmin(true)
      localStorage.setItem('admin', 'true')
    } else {
      alert('密码错误')
    }
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

  // 服务端获取数据
  const getCategories = async (): Promise<Category[]> => {
    const res = await fetch('http://localhost:3000/api/categories', { cache: 'no-store' })
    return res.json()
  }

  const getLatestResources = async (): Promise<ResourceWithCategory[]> => {
    const res = await fetch('http://localhost:3000/api/resources?limit=6', { cache: 'no-store' })
    return res.json()
  }

  const getTopResources = async (): Promise<ResourceWithCategory[]> => {
    const res = await fetch('http://localhost:3000/api/resources', { cache: 'no-store' })
    const data = await res.json()
    return data.sort((a: Resource, b: Resource) => b.rating - a.rating).slice(0, 3)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={isAdmin || localStorage.getItem('admin') === 'true'} onLogout={handleLogout} />
      
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
          isAdmin={isAdmin || localStorage.getItem('admin') === 'true'}
          onClose={() => setSelectedResource(null)}
          onUpdateNotes={handleUpdateNotes}
        />
      )}
      
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (async () => {
              const categoriesRes = await fetch('/api/categories');
              const categories = await categoriesRes.json();
              window.dispatchEvent(new CustomEvent('categoriesLoaded', { detail: categories }));
              
              const latestRes = await fetch('/api/resources');
              const latestData = await latestRes.json();
              window.dispatchEvent(new CustomEvent('latestResourcesLoaded', { detail: latestData.slice(0, 6) }));
              
              const topRes = await fetch('/api/resources');
              const topData = await topRes.json();
              const sortedTop = topData.sort((a, b) => b.rating - a.rating).slice(0, 3);
              window.dispatchEvent(new CustomEvent('topResourcesLoaded', { detail: sortedTop }));
            })();
          `,
        }}
      />
      
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('categoriesLoaded', (e) => {
              if (window.updateCategories) {
                window.updateCategories(e.detail);
              }
            });
            window.addEventListener('latestResourcesLoaded', (e) => {
              if (window.updateLatestResources) {
                window.updateLatestResources(e.detail);
              }
            });
            window.addEventListener('topResourcesLoaded', (e) => {
              if (window.updateTopResources) {
                window.updateTopResources(e.detail);
              }
            });
          `,
        }}
      />
    </div>
  )
}
