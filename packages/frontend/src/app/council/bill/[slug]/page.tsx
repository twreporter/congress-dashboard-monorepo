export const dynamic = 'force-dynamic'
export const dynamicParams = true

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
// fetcher
import { fetchBillBySlug } from '@/fetchers/server/council-bill'
// constants
import { InternalRoutes } from '@/constants/routes'
import { OG_IMAGE_URL } from '@/constants'
// components
import BillPage from '@/components/bill'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const bill = await fetchBillBySlug({ slug })
  if (!bill) {
    notFound()
  }
  const { title, summary } = bill
  const titleForMetaData =
    title.length > 15 ? `${title.slice(0, 15)}...` : title
  const descriptionForMetaData = summary
    ? `本次議案中，${summary.replace(/<\/?(?:ul|li)>/g, '').replace(/\n/g, '')}`
    : '報導者觀測站 | 議案'
  return {
    title: `議案｜${titleForMetaData} - 報導者觀測站`,
    description: descriptionForMetaData,
    alternates: {
      canonical: `https://lawmaker.twreporter.org${InternalRoutes.Bill}/${slug}`,
    },
    openGraph: {
      title: `議案｜${titleForMetaData} - 報導者觀測站`,
      description: descriptionForMetaData,
      url: `https://lawmaker.twreporter.org${InternalRoutes.Bill}/${slug}`,
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
    const bill = await fetchBillBySlug({ slug })
    if (!bill) {
      notFound()
    }
    return <BillPage bill={bill} />
  } catch (error) {
    console.error('Error fetching bill data:', error)
    return <div>Failed to load council bill data. Please try again later.</div>
  }
}
