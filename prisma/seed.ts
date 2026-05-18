import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'Vibe Coding', parentId: null, order: 1 },
  { name: 'AI 提示词', parentId: null, order: 2 },
  { name: '官方文档', parentId: null, order: 3 },
  { name: '学习教程', parentId: null, order: 4 },
  { name: '开源项目', parentId: null, order: 5 },
]

const resources = [
  {
    name: 'Vibe coding学习项目',
    url: 'https://github.com/2025Emma/vibe-coding-cn',
    description: '一个基于 Vibe 的中文编程学习项目，帮助开发者快速上手 Vibe 框架。',
    categoryName: 'Vibe Coding',
    tags: ['Vibe', '学习', '编程'],
    difficulty: 'BEGINNER' as const,
    rating: 5,
    sourceType: 'GITHUB' as const,
    myNotes: '这是一个很好的入门项目，适合初学者学习 Vibe 框架。',
  },
  {
    name: 'easy vibe学习网站',
    url: 'https://datawhalechina.github.io/easy-vibe/zh-cn/',
    description: 'DataWhale 社区开发的 Vibe 学习网站，提供系统化的学习路径。',
    categoryName: 'Vibe Coding',
    tags: ['Vibe', '教程', '学习'],
    difficulty: 'BEGINNER' as const,
    rating: 4,
    sourceType: 'WEBSITE' as const,
    myNotes: '内容非常详细，适合系统学习。',
  },
  {
    name: 'TRAE官方知识库',
    url: 'https://lcnziv86vkx6.feishu.cn/wiki/XZOSwI51wi5a5okxCF4cAxHSnBh',
    description: 'TRAE 官方知识库，包含平台使用指南和最佳实践。',
    categoryName: '官方文档',
    tags: ['TRAE', '官方', '文档'],
    difficulty: 'INTERMEDIATE' as const,
    rating: 5,
    sourceType: 'DOCUMENT' as const,
    myNotes: '官方文档，内容权威。',
  },
  {
    name: 'AI提示词项目',
    url: 'https://github.com/jb9679113/prompts.chat',
    description: '一个收集和分享 AI 提示词的项目，帮助用户更好地使用 AI 工具。',
    categoryName: 'AI 提示词',
    tags: ['AI', '提示词', 'ChatGPT'],
    difficulty: 'BEGINNER' as const,
    rating: 4,
    sourceType: 'GITHUB' as const,
    myNotes: '非常实用的提示词资源库。',
  },
]

async function main() {
  console.log('Starting seed...')

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { name: cat.name } })
    if (!existing) {
      await prisma.category.create({ data: cat })
      console.log(`Created category: ${cat.name}`)
    } else {
      console.log(`Category already exists: ${cat.name}`)
    }
  }

  for (const resource of resources) {
    const category = await prisma.category.findUnique({ where: { name: resource.categoryName } })
    if (!category) {
      console.log(`Category not found: ${resource.categoryName}`)
      continue
    }

    const existing = await prisma.resource.findFirst({
      where: { url: resource.url },
    })

    if (!existing) {
      await prisma.resource.create({
        data: {
          ...resource,
          categoryId: category.id,
        },
      })
      console.log(`Created resource: ${resource.name}`)
    } else {
      console.log(`Resource already exists: ${resource.name}`)
    }
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
