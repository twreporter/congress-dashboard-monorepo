const isRelease = process.env.NEXT_PUBLIC_RELEASE_BRANCH === 'release'
// use ISR in production & SSR in other envs (disabled cache)
export const dynamic = isRelease ? 'auto' : 'force-dynamic'
// cache html & data for 2hr in release
export const revalidate = isRelease ? 7200 : undefined

import { cache } from 'react'
import { Metadata } from 'next'
// components
import AboutPage from '@/components/about'
// constants
import { InternalRoutes } from '@/constants/routes'
import { OG_IMAGE_URL } from '@/constants'

const getAboutPageFromGo = cache(async () => {
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
  return data
})

export async function generateMetadata(): Promise<Metadata> {
  const { og_title, og_description, og_image } = await getAboutPageFromGo()
  const title = og_title || '關於觀測站 - 報導者觀測站'
  const description = og_description || '報導者觀測站'
  const image = og_image?.resized_targets?.tablet?.url || OG_IMAGE_URL
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
      images: image,
    },
  }
}

export default async function Page() {
  const { content, title, subtitle, brief } = await getAboutPageFromGo()
  return (
    <AboutPage
      title={title}
      subtitle={subtitle}
      brief={brief}
      content={content}
    />
  )
}
