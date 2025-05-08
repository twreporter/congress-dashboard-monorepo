import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// components
import SpeechPage from '@/components/speech'
// fetcher
import { fetchSpeech, fetchSpeechGroup } from '@/fetchers/server/speech'
// constants
import { InternalRoutes } from '@/constants/navigation-link'

export const dynamicParams = true

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
  const { title, legislativeYuanMember } = speech
  const { legislator } = legislativeYuanMember
  const { name } = legislator
  const titleForMetaData =
    title.length > 15 ? `${title.slice(0, 15)}...` : title
  return {
    title: `逐字稿｜${name}：${titleForMetaData} - 報導者觀測站`,
    description: '報導者議會透視版',
    alternates: {
      canonical: `https://lawmaker.twreporter${InternalRoutes.Speech}/${slug}`,
    },
    openGraph: {
      title: `逐字稿｜${name}：${titleForMetaData} - 報導者觀測站`,
      url: `https://lawmaker.twreporter${InternalRoutes.Speech}/${slug}`,
      type: 'article',
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
