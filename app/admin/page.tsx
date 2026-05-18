'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import ResourceForm from '@/components/ResourceForm'
import CategoryForm from '@/components/CategoryForm'
import type { Resource, Category as PrismaCategory } from '@prisma/client'

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
type SourceType = 'GITHUB' | 'WEBSITE' | 'DOCUMENT' | 'OTHER'

interface Category extends PrismaCategory {
  children?: Category[]
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('resources')
  const [resources, setResources] = useState<Resource[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showResourceForm, setShowResourceForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    if (localStorage.getItem('admin') === 'true') {
      setIsLoggedIn(true)
      fetchResources()
      fetchCategories()
    }
  }, [])

  const handleLogin = async () => {
    const response = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await response.json()
    if (data.success) {
      setIsLoggedIn(true)
      localStorage.setItem('admin', 'true')
      fetchResources()
      fetchCategories()
    } else {
      setError('密码错误，请重试')
    }
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
    await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setShowResourceForm(false)
    fetchResources()
  }

  const handleUpdateResource = async (data: Partial<Resource> & { categoryId: string }) => {
    if (!editingResource) return
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
    if (confirm('确定要删除这个资源吗？')) {
      await fetch(`/api/resources/${id}`, { method: 'DELETE' })
      fetchResources()
    }
  }

  const handleAddCategory = async (data: { name: string; parentId: string | null; order: number }) => {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setShowCategoryForm(false)
    fetchCategories()
  }

  const handleUpdateCategory = async (data: { name: string; parentId: string | null; order: number }) => {
    if (!editingCategory) return
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
    if (confirm('确定要删除这个分类吗？相关资源也会被删除。')) {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      fetchCategories()
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('admin')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">管理员登录</h2>
            <p className="text-gray-500 text-sm">请输入管理员密码</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入密码"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            
            <button
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              登录
            </button>
            
            <p className="text-center text-gray-400 text-sm">
              默认密码: admin123
            </p>
          </div>
        </div>
      </div>
    )
  }

  const allCategoriesList = categories.flatMap(cat => {
    const list: { id: string; name: string; parentId: string | null }[] = [{ id: cat.id, name: cat.name, parentId: cat.parentId }]
    const collectChildren = (children: Category[]) => {
      for (const child of children) {
        list.push({ id: child.id, name: child.name, parentId: child.parentId })
        if (child.children) collectChildren(child.children)
      }
    }
    if (cat.children) collectChildren(cat.children)
    return list
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={true} onLogout={handleLogout} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'resources'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            资源管理
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'categories'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            分类管理
          </button>
        </div>
        
        {activeTab === 'resources' && (
          <>
            <button
              onClick={() => { setShowResourceForm(true); setEditingResource(null) }}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              添加资源
            </button>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">名称</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">分类</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">难度</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">来源</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {resources.map((resource) => (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800 truncate max-w-xs">{resource.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{resource.url}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {allCategoriesList.find(c => c.id === resource.categoryId)?.name || '未分类'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          resource.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700' :
                          resource.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {difficultyLabels[resource.difficulty]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {sourceTypeLabels[resource.sourceType]}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingResource(resource); setShowResourceForm(true) }}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteResource(resource.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {resources.length === 0 && (
                <div className="text-center py-16 text-gray-400">暂无资源</div>
              )}
            </div>
          </>
        )}
        
        {activeTab === 'categories' && (
          <>
            <button
              onClick={() => { setShowCategoryForm(true); setEditingCategory(null) }}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              添加分类
            </button>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">名称</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">上级分类</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">排序</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allCategoriesList.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{category.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {category.parentId ? allCategoriesList.find(c => c.id === category.parentId)?.name : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{category.order}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingCategory(category); setShowCategoryForm(true) }}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {allCategoriesList.length === 0 && (
                <div className="text-center py-16 text-gray-400">暂无分类</div>
              )}
            </div>
          </>
        )}
        
        {showResourceForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingResource ? '编辑资源' : '添加资源'}
              </h2>
              <ResourceForm
                categories={allCategoriesList}
                resource={editingResource}
                onSubmit={editingResource ? handleUpdateResource : handleAddResource}
                onCancel={() => { setShowResourceForm(false); setEditingResource(null) }}
              />
            </div>
          </div>
        )}
        
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingCategory ? '编辑分类' : '添加分类'}
              </h2>
              <CategoryForm
                categories={categories}
                category={editingCategory}
                onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
                onCancel={() => { setShowCategoryForm(false); setEditingCategory(null) }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
