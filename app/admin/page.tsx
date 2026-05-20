'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import LoginForm from '@/components/LoginForm'
import ResourceForm from '@/components/ResourceForm'
import CategoryForm from '@/components/CategoryForm'
import type { Resource } from '@prisma/client'

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
type SourceType = 'GITHUB' | 'WEBSITE' | 'DOCUMENT' | 'OTHER'

interface Category {
  id: string
  name: string
  parentId: string | null
  order: number
  createdAt: Date
  updatedAt: Date
  children?: Category[]
}

interface User {
  id: string
  email: string
  role: string
}

const difficultyLabels: Record<Difficulty, string> = {
  BEGINNER: '入门',
  INTERMEDIATE: '中级',
  ADVANCED: '高级',
}

const sourceTypeLabels: Record<SourceType, string> = {
  GITHUB: 'GitHub',
  WEBSITE: '网站',
  DOCUMENT: '文档',
  OTHER: '其他',
}

type TabType = 'resources' | 'categories'

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('resources')
  const [resources, setResources] = useState<Resource[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showResourceForm, setShowResourceForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        fetchResources()
        fetchCategories()
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleLogin = (userData: { id: string; email: string; role: string }) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    fetchResources()
    fetchCategories()
  }

  const fetchResources = async () => {
    const res = await fetch('/api/resources')
    const data = await res.json()
    setResources(data)
  }

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
  }

  const handleAddResource = async (data: Partial<Resource> & { categoryId: string }) => {
    if (user?.role !== 'ADMIN') return
    await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setShowResourceForm(false)
    fetchResources()
  }

  const handleUpdateResource = async (data: Partial<Resource> & { categoryId: string }) => {
    if (user?.role !== 'ADMIN' || !editingResource) return
    await fetch(`/api/resources/${editingResource.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setShowResourceForm(false)
    setEditingResource(null)
    fetchResources()
  }

  const handleDeleteResource = async (id: string) => {
    if (user?.role !== 'ADMIN') return
    if (confirm('确定要删除这个资源吗？')) {
      await fetch(`/api/resources/${id}`, { method: 'DELETE' })
      fetchResources()
    }
  }

  const handleAddCategory = async (data: { name: string; parentId: string | null; order: number }) => {
    if (user?.role !== 'ADMIN') return
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setShowCategoryForm(false)
    fetchCategories()
  }

  const handleUpdateCategory = async (data: { name: string; parentId: string | null; order: number }) => {
    if (user?.role !== 'ADMIN' || !editingCategory) return
    await fetch(`/api/categories/${editingCategory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setShowCategoryForm(false)
    setEditingCategory(null)
    fetchCategories()
  }

  const handleDeleteCategory = async (id: string) => {
    if (user?.role !== 'ADMIN') return
    if (confirm('确定要删除这个分类吗？相关资源也会被删除。')) {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      fetchCategories()
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  const isAdmin = user.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isAdmin={isAdmin} 
        onLogout={handleLogout} 
        currentUser={user}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800">后台管理</h1>
              <p className="text-gray-500 text-sm mt-1">
                当前用户: {user.email} ({user.role === 'ADMIN' ? '管理员' : '普通用户'})
                {!isAdmin && ' - 您只有查看权限'}
              </p>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <>
                  <button
                    onClick={() => setShowResourceForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    添加资源
                  </button>
                  <button
                    onClick={() => setShowCategoryForm(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    添加分类
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'resources' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              资源管理
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'categories' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              分类管理
            </button>
          </div>
          
          {activeTab === 'resources' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">名称</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">难度</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">来源</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">评分</th>
                    {isAdmin && <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">操作</th>}
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 text-sm"
                        >
                          {resource.name}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {difficultyLabels[resource.difficulty as Difficulty]}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {sourceTypeLabels[resource.sourceType as SourceType]}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{resource.rating}</td>
                      {isAdmin && (
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingResource(resource)
                                setShowResourceForm(true)
                              }}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteResource(resource.id)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'categories' && (
            <div className="space-y-3">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-800">{category.name}</div>
                    <div className="text-sm text-gray-500">
                      {category.parentId ? '子分类' : '主分类'}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category)
                          setShowCategoryForm(true)
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {showResourceForm && (
        <ResourceForm
          resource={editingResource}
          categories={categories}
          onSubmit={editingResource ? handleUpdateResource : handleAddResource}
          onCancel={() => {
            setShowResourceForm(false)
            setEditingResource(null)
          }}
        />
      )}
      
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          categories={categories}
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
          onCancel={() => {
            setShowCategoryForm(false)
            setEditingCategory(null)
          }}
        />
      )}
    </div>
  )
}
