import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Category as PrismaCategory } from '@prisma/client'

interface CategoryWithChildren extends PrismaCategory {
  children: CategoryWithChildren[]
}

export async function GET(request: Request) {
  try {
    const categories = await prisma.category.findMany({
      include: { children: true },
      orderBy: { order: 'asc' },
    })

    const buildTree = (parentId: string | null): CategoryWithChildren[] => {
      return categories
        .filter((cat: PrismaCategory) => cat.parentId === parentId)
        .map((cat: PrismaCategory) => ({
          ...cat,
          children: buildTree(cat.id),
        }))
    }

    const tree = buildTree(null)
    return NextResponse.json(tree)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  const { name, parentId, order } = await request.json()

  try {
    const category = await prisma.category.create({
      data: {
        name,
        parentId: parentId || null,
        order: order || 0,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
