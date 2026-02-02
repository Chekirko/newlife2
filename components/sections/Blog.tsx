'use client'

import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =========================================
// BLOG POST INTERFACE
// =========================================
export interface BlogPostData {
  id: string
  image?: string | StaticImageData
  tag?: string
  author?: string
  date?: string
  title: string
  excerpt?: string
  href?: string
}

// =========================================
// BLOG VARIANT 1: Carousel/Slider
// (home demo style)
// =========================================
export interface BlogCarouselProps {
  preTitle?: string
  title?: string
  description?: string
  posts: BlogPostData[]
  className?: string
}

export const BlogCarousel = ({
  preTitle,
  title,
  description,
  posts,
  className,
}: BlogCarouselProps) => {
  return (
    <section className={clsx('blog pb-0', className)}>
      <div className="container-larexa">
        {(preTitle || title || description) && (
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="title">
              {preTitle && <span className="pre-title">{preTitle}</span>}
              {title && <h2>{title}</h2>}
              {description && <p className="mb-0">{description}</p>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="post">
              {post.image && (
                <div className="post-img mb-4">
                  <Image 
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="rounded w-full"
                  />
                </div>
              )}
              <div className="post-info">
                {post.tag && (
                  <span className="post-tag bg-grad text-white mb-3 inline-block px-3 py-1 rounded text-sm">
                    <Link href={post.href || '#'}>{post.tag}</Link>
                  </span>
                )}
                <div className="flex gap-2 text-sm text-gray-500 mb-2">
                  {post.author && (
                    <span className="post-author">
                      <Link href="#">{post.author}</Link>
                    </span>
                  )}
                  {post.author && post.date && <span>,</span>}
                  {post.date && (
                    <span className="post-time">
                      <Link href="#">{post.date}</Link>
                    </span>
                  )}
                </div>
                <Link href={post.href || '#'} className="post-title text-xl font-bold hover:text-primary">
                  {post.title}
                </Link>
                {post.excerpt && <p className="mb-0 mt-2">{post.excerpt}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// BLOG VARIANT 2: Grid with Sidebar
// =========================================
export interface BlogGridProps {
  posts: BlogPostData[]
  columns?: 2 | 3 | 4
  showExcerpt?: boolean
  className?: string
}

export const BlogGrid = ({
  posts,
  columns = 3,
  showExcerpt = true,
  className,
}: BlogGridProps) => {
  const columnClasses = {
    2: 'md:w-1/2',
    3: 'md:w-1/2 lg:w-1/3',
    4: 'sm:w-1/2 lg:w-1/4',
  }

  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap -mx-4">
          {posts.map((post) => (
            <div key={post.id} className={clsx('w-full px-4 mb-8', columnClasses[columns])}>
              <div className="post h-full">
                {post.image && (
                  <div className="post-img mb-4">
                    <Link href={post.href || '#'}>
                      <Image 
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="rounded w-full hover:opacity-90 transition-opacity"
                      />
                    </Link>
                  </div>
                )}
                <div className="post-info">
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                    {post.tag && (
                      <span className="post-tag text-primary">
                        {post.tag}
                      </span>
                    )}
                    {post.date && <span>• {post.date}</span>}
                  </div>
                  <Link href={post.href || '#'} className="post-title text-lg font-bold hover:text-primary block">
                    {post.title}
                  </Link>
                  {showExcerpt && post.excerpt && (
                    <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// BLOG VARIANT 3: List Style
// =========================================
export interface BlogListProps {
  posts: BlogPostData[]
  showImage?: boolean
  className?: string
}

export const BlogList = ({
  posts,
  showImage = true,
  className,
}: BlogListProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="post flex flex-col md:flex-row gap-6">
              {showImage && post.image && (
                <div className="md:w-1/3 flex-shrink-0">
                  <Link href={post.href || '#'}>
                    <Image 
                      src={post.image}
                      alt={post.title}
                      width={300}
                      height={200}
                      className="rounded w-full hover:opacity-90 transition-opacity"
                    />
                  </Link>
                </div>
              )}
              <div className="post-info flex-1">
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                  {post.tag && <span className="text-primary font-medium">{post.tag}</span>}
                  {post.author && <span>by {post.author}</span>}
                  {post.date && <span>• {post.date}</span>}
                </div>
                <Link href={post.href || '#'} className="post-title text-2xl font-bold hover:text-primary block mb-2">
                  {post.title}
                </Link>
                {post.excerpt && <p className="text-gray-600">{post.excerpt}</p>}
                <Link href={post.href || '#'} className="text-primary font-medium mt-2 inline-block hover:underline">
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================
// BLOG VARIANT 4: Featured + Grid
// =========================================
export interface BlogFeaturedProps {
  featuredPost: BlogPostData
  posts: BlogPostData[]
  className?: string
}

export const BlogFeatured = ({
  featuredPost,
  posts,
  className,
}: BlogFeaturedProps) => {
  return (
    <section className={className}>
      <div className="container-larexa">
        <div className="flex flex-wrap -mx-4">
          {/* Featured post */}
          <div className="w-full lg:w-1/2 px-4 mb-8">
            <div className="post h-full relative rounded overflow-hidden">
              {featuredPost.image && (
                <Image 
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {featuredPost.tag && (
                  <span className="bg-grad px-3 py-1 rounded text-sm inline-block mb-3">
                    {featuredPost.tag}
                  </span>
                )}
                <Link href={featuredPost.href || '#'} className="text-2xl lg:text-3xl font-bold text-white hover:text-primary-light block">
                  {featuredPost.title}
                </Link>
                <div className="flex gap-2 text-sm text-white/70 mt-2">
                  {featuredPost.author && <span>{featuredPost.author}</span>}
                  {featuredPost.date && <span>• {featuredPost.date}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Regular posts */}
          <div className="w-full lg:w-1/2 px-4">
            <div className="space-y-6">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="post flex gap-4">
                  {post.image && (
                    <div className="w-24 h-24 flex-shrink-0">
                      <Image 
                        src={post.image}
                        alt={post.title}
                        width={96}
                        height={96}
                        className="rounded w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="post-info">
                    {post.tag && <span className="text-primary text-sm">{post.tag}</span>}
                    <Link href={post.href || '#'} className="font-bold hover:text-primary block">
                      {post.title}
                    </Link>
                    {post.date && <span className="text-sm text-gray-500">{post.date}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================
// Default exports
// =========================================
export { BlogCarousel as Blog }
export { BlogCarousel as BlogSection }
export default BlogCarousel
