import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// components
import SpeechPage from '@/components/speech'
// fetcher
import { fetchSpeech, fetchSpeechGroup } from '@/fetchers/server/speech'

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
  return {
    title: `逐字稿 - ${name} - ${title}`,
    description: `議會逐字稿 - ${title}`,
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
