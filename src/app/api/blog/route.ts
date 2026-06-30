import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publishedOnly = searchParams.get('published') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    const where = publishedOnly ? { published: true } : {}

    const posts = await prisma.blogPost.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ success: true, data: posts })
  } catch {
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 })

    const body = await request.json()
    const { title, content, excerpt, imageUrl, published } = body

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'العنوان والمحتوى مطلوبان' }, { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: generateSlug(title),
        content,
        excerpt,
        imageUrl,
        published: published || false,
        authorId: authUser.id,
      },
    })

    return NextResponse.json({ success: true, data: post }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
