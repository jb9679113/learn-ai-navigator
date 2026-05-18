import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function parseTags(tags: string): string[] {
  if (!tags) return []
  try {
    return JSON.parse(tags)
  } catch {
    return tags.split(',').map(t => t.trim()).filter(t => t)
  }
}

function serializeTags(tags: string[]): string {
  return JSON.stringify(tags)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const categoryId = searchParams.get('categoryId')
  const search = searchParams.get('search')
  const difficulty = searchParams.get('difficulty') || null
  const sourceType = searchParams.get('sourceType') || null
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
              { name: { contains: search } },
              { description: { contains: search } },
            ]
          : undefined,
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })

    const formattedResources = resources.map(r => ({
      ...r,
      tags: parseTags(r.tags),
    }))

    return NextResponse.json(formattedResources)
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
        tags: serializeTags(tags || []),
        difficulty: difficulty || 'BEGINNER',
        rating: rating || 0,
        sourceType: sourceType || 'OTHER',
        myNotes,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
      include: { category: true },
    })

    return NextResponse.json({ ...resource, tags: parseTags(resource.tags) }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
  }
}
