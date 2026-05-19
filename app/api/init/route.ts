import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const categories = [
  { name: 'Vibe Coding', parentId: null, order: 1 },
  { name: 'AI 提示词', parentId: null, order: 2 },
  { name: '官方文档', parentId: null, order: 3 },
  { name: '学习教程', parentId: null, order: 4 },
  { name: '学习项目', parentId: null, order: 5 },
  { name: '开源项目', parentId: null, order: 6 },
  { name: 'AI平台', parentId: null, order: 7 },
  { name: '组件库', parentId: null, order: 8 },
  { name: '后端开发', parentId: null, order: 9 },
]

const resources = [
  {
    name: 'Vibe coding学习项目',
    url: 'https://github.com/2025Emma/vibe-coding-cn',
    description: '一个基于 Vibe 的中文编程学习项目，帮助开发者快速上手 Vibe 框架。',
    categoryName: 'Vibe Coding',
    tags: ['Vibe', '学习', '编程'],
    difficulty: 'BEGINNER',
    rating: 5,
    sourceType: 'GITHUB',
    myNotes: '这是一个很好的入门项目，适合初学者学习 Vibe 框架。',
  },
  {
    name: 'easy vibe学习网站',
    url: 'https://datawhalechina.github.io/easy-vibe/zh-cn/',
    description: 'DataWhale 社区开发的 Vibe 学习网站，提供系统化的学习路径。',
    categoryName: 'Vibe Coding',
    tags: ['Vibe', '教程', '学习'],
    difficulty: 'BEGINNER',
    rating: 4,
    sourceType: 'WEBSITE',
    myNotes: '内容非常详细，适合系统学习。',
  },
  {
    name: 'TRAE官方知识库',
    url: 'https://lcnziv86vkx6.feishu.cn/wiki/XZOSwI51wi5a5okxCF4cAxHSnBh',
    description: 'TRAE 官方知识库，包含平台使用指南和最佳实践。',
    categoryName: '官方文档',
    tags: ['TRAE', '官方', '文档'],
    difficulty: 'INTERMEDIATE',
    rating: 5,
    sourceType: 'DOCUMENT',
    myNotes: '官方文档，内容权威。',
  },
  {
    name: 'AI提示词项目',
    url: 'https://github.com/jb9679113/prompts.chat',
    description: '一个收集和分享 AI 提示词的项目，帮助用户更好地使用 AI 工具。',
    categoryName: 'AI 提示词',
    tags: ['AI', '提示词', 'ChatGPT'],
    difficulty: 'BEGINNER',
    rating: 4,
    sourceType: 'GITHUB',
    myNotes: '非常实用的提示词资源库。',
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com',
    description: 'Vercel 是一个专注于前端和全栈应用的云平台，它通过一体化开发部署平台，让开发者能够更快地构建和部署应用。',
    categoryName: '后端开发',
    tags: ['Vercel', '部署', '云平台'],
    difficulty: 'ADVANCED',
    rating: 5,
    sourceType: 'WEBSITE',
    myNotes: '非常优秀的部署平台。',
  },
  {
    name: 'Supabase',
    url: 'https://supabase.com',
    description: 'Supabase 是一个开源的 Firebase 替代方案，提供数据库、认证、存储等功能。',
    categoryName: '后端开发',
    tags: ['Supabase', '数据库', '后端'],
    difficulty: 'ADVANCED',
    rating: 5,
    sourceType: 'WEBSITE',
    myNotes: '强大的后端即服务平台。',
  },
  {
    name: 'Ant Design',
    url: 'https://ant.design',
    description: 'Ant Design 是基于 React 的企业级 UI 组件库，提供丰富的组件和设计规范。',
    categoryName: '组件库',
    tags: ['React', 'UI', '组件库'],
    difficulty: 'INTERMEDIATE',
    rating: 5,
    sourceType: 'WEBSITE',
    myNotes: '企业级 UI 组件库的标杆。',
  },
  {
    name: 'shadcn/ui',
    url: 'https://ui.shadcn.com',
    description: 'shadcn/ui 是一套设计精美、易于使用的组件库，基于 Tailwind CSS 和 Radix UI 构建。',
    categoryName: '组件库',
    tags: ['React', 'UI', 'Tailwind'],
    difficulty: 'INTERMEDIATE',
    rating: 5,
    sourceType: 'WEBSITE',
    myNotes: '现代化的 UI 组件库。',
  },
  {
    name: 'Open-design',
    url: 'https://github.com/open-design',
    description: '一个开源的、原生支持代理的 Claude Design / Figma 替代方案。',
    categoryName: '开源项目',
    tags: ['设计', 'Figma', '开源'],
    difficulty: 'INTERMEDIATE',
    rating: 4,
    sourceType: 'GITHUB',
    myNotes: '不错的设计工具。',
  },
  {
    name: '莫高设计',
    url: 'https://www.mogao.design',
    description: 'MogaoDesign 作为一款国产在线协同设计平台，凭借其前沿的 AI 技术、强大的协作功能，为设计师提供高效的设计解决方案。',
    categoryName: 'AI平台',
    tags: ['设计', 'AI', '协作'],
    difficulty: 'BEGINNER',
    rating: 4,
    sourceType: 'WEBSITE',
    myNotes: '国产优秀设计平台。',
  },
  {
    name: '个人作品集简单两页的...',
    url: 'https://github.com',
    description: '学习 Figma Sites 的基础知识，以便您可以在一个地方设计、制作原型和发布作品集网站。',
    categoryName: '学习项目',
    tags: ['Figma', '作品集', '学习'],
    difficulty: 'BEGINNER',
    rating: 3,
    sourceType: 'GITHUB',
    myNotes: '适合初学者的项目。',
  },
  {
    name: 'Figma 设计入门',
    url: 'https://www.figma.com/learn',
    description: '通过这门实践课程，开启您的 Figma 设计学习之路。我们将从零开始设计一个完整的产品界面。',
    categoryName: '学习教程',
    tags: ['Figma', '设计', '教程'],
    difficulty: 'BEGINNER',
    rating: 4,
    sourceType: 'WEBSITE',
    myNotes: 'Figma 官方学习资源。',
  },
  {
    name: 'Kollab平台',
    url: 'https://kollab.app',
    description: 'Kollab 是一个专注团队协作、任务管理与 AI Agent 自动化的新一代协作平台。',
    categoryName: 'AI平台',
    tags: ['协作', 'AI', '团队'],
    difficulty: 'INTERMEDIATE',
    rating: 4,
    sourceType: 'WEBSITE',
    myNotes: '集成 AI 的协作平台。',
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { secret } = body

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results: { created: string[]; skipped: string[]; updated: string[] } = {
      created: [],
      skipped: [],
      updated: [],
    }

    for (const cat of categories) {
      const existing = await prisma.category.findUnique({ where: { name: cat.name } })
      if (!existing) {
        await prisma.category.create({ data: cat })
        results.created.push(`Category: ${cat.name}`)
      } else {
        results.skipped.push(`Category: ${cat.name} (already exists)`)
      }
    }

    for (const resource of resources) {
      const category = await prisma.category.findUnique({ where: { name: resource.categoryName } })
      if (!category) {
        results.skipped.push(`Resource: ${resource.name} (category not found)`)
        continue
      }

      const existing = await prisma.resource.findFirst({
        where: { url: resource.url },
      })

      if (!existing) {
        const { categoryName, ...resourceData } = resource
        await prisma.resource.create({
          data: {
            ...resourceData,
            categoryId: category.id,
            tags: JSON.stringify(resource.tags),
          },
        })
        results.created.push(`Resource: ${resource.name}`)
      } else {
        const { categoryName, ...resourceData } = resource
        await prisma.resource.update({
          where: { id: existing.id },
          data: {
            ...resourceData,
            categoryId: category.id,
            tags: JSON.stringify(resource.tags),
          },
        })
        results.updated.push(`Resource: ${resource.name}`)
      }
    }

    return NextResponse.json({
      message: 'Seed completed successfully!',
      results,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}
