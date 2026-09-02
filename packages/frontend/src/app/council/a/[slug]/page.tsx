export const dynamic = 'force-dynamic'
export const dynamicParams = true

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// components
import SpeechPage from '@/components/council-speech'
// fetcher
import { fetchCouncilSpeech } from '@/fetchers/server/council-speech'
// constants
import { InternalRoutes } from '@/constants/routes'
import { OG_IMAGE_URL } from '@/constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const speech = await fetchCouncilSpeech({ slug })
  if (!speech) {
    notFound()
  }
  const { title, councilMember, summary } = speech
  const councilorNames =
    (councilMember ?? []).map(({ councilor }) => councilor.name).join('、') ||
    '縣市議會'
  const titleForMetaData =
    title.length > 15 ? `${title.slice(0, 15)}...` : title
  const descriptionForMetaData = summary
    ? `本場會議中，${summary.replace(/<\/?(?:ul|li)>/g, '').replace(/\n/g, '')}`
    : '報導者觀測站 | 逐字稿'
  return {
    title: `逐字稿｜${councilorNames}：${titleForMetaData} - 報導者觀測站`,
    description: descriptionForMetaData,
    alternates: {
      canonical: `https://lawmaker.twreporter.org${InternalRoutes.CouncilSpeech}/${slug}`,
    },
    openGraph: {
      title: `逐字稿｜${councilorNames}：${titleForMetaData} - 報導者觀測站`,
      description: descriptionForMetaData,
      url: `https://lawmaker.twreporter.org${InternalRoutes.CouncilSpeech}/${slug}`,
      type: 'article',
      images: OG_IMAGE_URL,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  try {
    const { slug } = await params
    const speech = await fetchCouncilSpeech({ slug })
    if (!speech) {
      notFound()
    }

    return <SpeechPage speech={speech} />
  } catch (error) {
    console.error('Error fetching council speech data:', error)
    return (
      <div>Failed to load council speech data. Please try again later.</div>
    )
  }
}
