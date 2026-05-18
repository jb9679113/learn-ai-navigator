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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      include: { category: true },
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    return NextResponse.json({ ...resource, tags: parseTags(resource.tags) })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { name, url, description, categoryId, tags, difficulty, rating, sourceType, myNotes, isPublished } = await request.json()

  try {
    const resource = await prisma.resource.update({
      where: { id: params.id },
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

    return NextResponse.json({ ...resource, tags: parseTags(resource.tags) })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.resource.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Resource deleted successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}
