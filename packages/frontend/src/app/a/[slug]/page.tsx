// use ISR cache 2hr
export const revalidate = 7200
export const dynamicParams = true

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// components
import SpeechPage from '@/components/speech'
// fetcher
import { fetchSpeech, fetchSpeechGroup } from '@/fetchers/server/speech'
// constants
import { InternalRoutes } from '@/constants/routes'
import { OG_IMAGE_URL } from '@/constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const speech = await fetchSpeech({ slug })
  if (!speech) {
    notFound()
  }
  const { title, legislativeYuanMember, summary } = speech
  const { legislator } = legislativeYuanMember
  const { name } = legislator
  const titleForMetaData =
    title.length > 15 ? `${title.slice(0, 15)}...` : title
  const descriptionForMetaData = summary
    ? `本場會議中，${summary.replace(/<\/?(?:ul|li)>/g, '').replace(/\n/g, '')}`
    : '報導者觀測站 | 逐字稿'
  return {
    title: `逐字稿｜${name}：${titleForMetaData} - 報導者觀測站`,
    description: descriptionForMetaData,
    alternates: {
      canonical: `https://lawmaker.twreporter.org${InternalRoutes.Speech}/${slug}`,
    },
    openGraph: {
      title: `逐字稿｜${name}：${titleForMetaData} - 報導者觀測站`,
      description: descriptionForMetaData,
      url: `https://lawmaker.twreporter.org${InternalRoutes.Speech}/${slug}`,
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
    const speech = await fetchSpeech({ slug })
    if (!speech) {
      notFound()
    }
    const { title, date } = speech
    const speechGroup = await fetchSpeechGroup({ title, date })
    return <SpeechPage speech={speech} speechGroup={speechGroup} />
  } catch (error) {
    console.error('Error fetching speech data:', error)
    return <div>Failed to load speech data. Please try again later.</div>
  }
}
