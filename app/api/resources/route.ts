import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Resource, Difficulty, SourceType } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const categoryId = searchParams.get('categoryId')
  const search = searchParams.get('search')
  const difficulty = searchParams.get('difficulty') as Difficulty | null
  const sourceType = searchParams.get('sourceType') as SourceType | null
  const tags = searchParams.get('tags')?.split(',') || []

  try {
    const resources = await prisma.resource.findMany({
      where: {
        isPublished: true,
        categoryId: categoryId || undefined,
        difficulty: difficulty || undefined,
        sourceType: sourceType || undefined,
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
        tags: tags.length > 0 ? { hasSome: tags } : undefined,
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(resources)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { name, url, description, categoryId, tags, difficulty, rating, sourceType, myNotes, isPublished } = await request.json()

  try {
    const resource = await prisma.resource.create({
      data: {
        name,
        url,
        description,
        categoryId,
        tags: tags || [],
        difficulty: difficulty as Difficulty,
        rating: rating || 0,
        sourceType: sourceType as SourceType,
        myNotes,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
      include: { category: true },
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
  }
}
