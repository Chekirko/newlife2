import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import Image from '@/components/ui/SiteImage'
import Link from 'next/link'

interface RecentPost {
  _id: string
  title: string
  slug: string
  publishedAt: string
  imageUrl: string | null
}

interface SidebarRecentPostsProps {
  posts: RecentPost[]
}

import { formatDate } from '@/lib/utils'

export function SidebarRecentPosts({ posts }: SidebarRecentPostsProps) {
  if (posts.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-primary">
        Останні новини
      </h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="flex gap-3 group">
            {/* Thumbnail */}
            <div className="relative w-[70px] h-[70px] flex-shrink-0 rounded-lg overflow-hidden">
              {post.imageUrl ? <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="70px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              /> : <ImagePlaceholder className="absolute inset-0" />}
            </div>
            {/* Details */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/news/${post.slug}`}
                className="text-sm font-medium text-gray-800 hover:text-primary-text transition-colors leading-snug line-clamp-2 block"
              >
                {post.title}
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(post.publishedAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
