import { Metadata } from 'next'
// components
import AboutPage from '@/components/about'
// constants
import { InternalRoutes } from '@/constants/routes'

export async function generateMetadata(): Promise<Metadata> {
  const url = process.env.NEXT_PUBLIC_TWREPORTER_API_URL as string
  const aboutPageSlug = process.env.NEXT_PUBLIC_ABOUT_PAGE_SLUG as string
  const res = await fetch(`${url}/v2/posts/${aboutPageSlug}?full=true`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch about page from API')
  }
  const { data } = await res.json()
  const { og_title, og_description } = data
  const title = og_title || '關於觀測站 - 報導者觀測站'
  const description = og_description || '報導者議會透視版'
  return {
    title,
    description,
    alternates: {
      canonical: `https://lawmaker.twreporter.org${InternalRoutes.About}`,
    },
    openGraph: {
      title,
      description,
      url: `https://lawmaker.twreporter.org${InternalRoutes.About}`,
      type: 'article',
    },
  }
}

export default async function Page() {
  const url = process.env.NEXT_PUBLIC_TWREPORTER_API_URL as string
  const aboutPageSlug = process.env.NEXT_PUBLIC_ABOUT_PAGE_SLUG as string
  const res = await fetch(`${url}/v2/posts/${aboutPageSlug}?full=true`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch about page from API')
  }
  const { data } = await res.json()
  const { content, title, subtitle, brief } = data
  return (
    <AboutPage
      title={title}
      subtitle={subtitle}
      brief={brief}
      content={content}
    />
  )
}
