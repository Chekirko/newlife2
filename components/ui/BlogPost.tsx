import { ReactNode } from 'react'
import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// =====================
// Blog Post Variants
// =====================
export type BlogPostVariant = 'default' | 'style-1' | 'style-2' | 'style-3'

// =====================
// Props Interface
// =====================
export interface BlogPostProps {
  title: string
  excerpt?: string
  image: string | StaticImageData
  author?: string
  date?: string
  category?: string
  categoryColor?: string
  href?: string
  variant?: BlogPostVariant
  className?: string
}

// =====================
// Blog Post Component
// =====================
export const BlogPost = ({
  title,
  excerpt,
  image,
  author,
  date,
  category,
  categoryColor = 'bg-primary',
  href = '#',
  variant = 'default',
  className,
}: BlogPostProps) => {
  return (
    <div className={clsx(
      variant === 'default' && 'post-default',
      variant === 'style-1' && 'post-style-1',
      variant === 'style-2' && 'post-style-2',
      variant === 'style-3' && 'post-style-3',
      className
    )}>
      <div className="post">
        {/* Image */}
        <div className="relative">
          <Link href={href}>
            <Image 
              src={image} 
              alt={title}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </Link>
          
          {/* Category tag */}
          {category && (
            <div className={clsx('post-tag', categoryColor)}>
              <Link href="#">{category}</Link>
            </div>
          )}
        </div>

        {/* Post info */}
        <div className="post-info">
          {/* Meta */}
          <div className="flex gap-4 text-gray-500 text-sm mb-2">
            {author && (
              <span className="post-author">
                <i className="far fa-user mr-1" />
                {author}
              </span>
            )}
            {date && (
              <span className="post-time">
                <i className="far fa-calendar-alt mr-1" />
                {date}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="post-title">
            <Link href={href}>{title}</Link>
          </h4>

          {/* Excerpt */}
          {excerpt && <p className="text-gray-600">{excerpt}</p>}
        </div>
      </div>
    </div>
  )
}

// =====================
// Blog Post Item (for blog pages)
// =====================
export interface BlogPostItemProps extends BlogPostProps {
  showReadMore?: boolean
  readMoreText?: string
}

export const BlogPostItem = ({
  showReadMore = true,
  readMoreText = 'Read more',
  ...props
}: BlogPostItemProps) => {
  return (
    <div className="post-item post-bb">
      <div className="post-image">
        {props.category && (
          <div className="post-meta-category bg-primary">
            <Link href="#">{props.category}</Link>
          </div>
        )}
        <Link href={props.href || '#'}>
          <Image 
            src={props.image} 
            alt={props.title}
            width={800}
            height={500}
            className="w-full h-auto"
          />
        </Link>
      </div>
      <div className="post-item-desc">
        {/* Meta */}
        <div className="flex gap-4">
          {props.author && (
            <span className="post-meta">
              <i className="far fa-user" />
              <Link href="#">{props.author}</Link>
            </span>
          )}
          {props.date && (
            <span className="post-meta">
              <i className="far fa-calendar-alt" />
              <Link href="#">{props.date}</Link>
            </span>
          )}
        </div>
        
        {/* Title */}
        <h4>
          <Link href={props.href || '#'}>{props.title}</Link>
        </h4>
        
        {/* Excerpt */}
        {props.excerpt && <p>{props.excerpt}</p>}
        
        {/* Read more */}
        {showReadMore && (
          <Link href={props.href || '#'} className="item-link">
            {readMoreText} <i className="fas fa-long-arrow-alt-right" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default BlogPost
