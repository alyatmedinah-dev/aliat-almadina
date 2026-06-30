import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug }, select: { title: true, excerpt: true } })
  if (!post) return { title: 'مقال غير موجود' }
  return { title: post.title, description: post.excerpt || undefined }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  })

  if (!post || !post.published) notFound()

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {post.imageUrl && (
        <div className="relative h-72 md:h-96 w-full bg-gray-900">
          <Image src={post.imageUrl} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#C9A84C] text-sm mb-6 hover:underline">
          <ArrowRight className="w-4 h-4" />
          العودة للمدونة
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

        <div className="flex items-center gap-5 text-gray-400 text-sm mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{post.author?.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <article className="prose prose-lg max-w-none text-gray-700 leading-8 whitespace-pre-wrap">
          {post.content}
        </article>
      </div>
    </div>
  )
}
