import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, BookOpen } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate, truncate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'المدونة العقارية',
  description: 'مقالات ونصائح عقارية من عالية المدينة للخدمات العقارية',
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="bg-[#0A0A0A] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">المدونة العقارية</h1>
          <p className="text-gray-400">نصائح ومقالات متخصصة في السوق العقاري بالمدينة المنورة</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد مقالات منشورة حالياً</p>
            <p className="text-gray-400 text-sm mt-1">تابعنا قريباً لمحتوى عقاري متخصص</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="luxury-card overflow-hidden group">
                <div className="relative h-48 bg-gray-100">
                  {post.imageUrl ? (
                    <Image src={post.imageUrl} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-gray-400 text-xs pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{post.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
