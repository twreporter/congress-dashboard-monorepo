// app/speech/[slug]/page.tsx
import { Metadata } from 'next'
import SpeechPage from '@/components/speech'

export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `逐字稿 - ${slug}`,
    description: '議會逐字稿',
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <SpeechPage slug={slug} />
}
