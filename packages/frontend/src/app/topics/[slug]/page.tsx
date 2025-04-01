// app/speech/[slug]/page.tsx
import { Metadata } from 'next'
import TopicPage from '@/components/topic'

export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `議題 - ${slug}`,
    description: '議題頁',
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <TopicPage slug={slug} />
}
