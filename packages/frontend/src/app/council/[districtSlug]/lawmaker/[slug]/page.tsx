export const dynamic = 'force-dynamic'
export const dynamicParams = true

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
// fetchers
import {
  fetchCouncilorName,
  fetchCouncilor,
  fetchCouncilorTopicsOfBill,
} from '@/fetchers/server/councilor'
// utils
import { isValidCouncil } from '@/utils/council'
// components
import CouncilorPage from '@/components/councilor'
// constants
import { InternalRoutes } from '@/constants/routes'
import { OG_IMAGE_URL } from '@/constants'
// @twreporter
import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'

type Params = {
  slug: string
  districtSlug: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug, districtSlug } = await params

  if (!isValidCouncil(districtSlug)) {
    notFound()
  }

  const councilorName = await fetchCouncilorName({ slug, districtSlug })
  if (!councilorName) {
    notFound()
  }

  const councilorPageUrl = `https://lawmaker.twreporter.org${InternalRoutes.Councilor(
    districtSlug
  )}/${slug}`
  const metaTitle = `${CITY_LABEL[districtSlug]}議員｜${councilorName} - 報導者觀測站`
  const metaDescription = `議員${councilorName}關心哪些議題、提出哪些議案？《報導者》用人工智慧技術分析，帶你快速掌握${councilorName}不同時段的提案重點。`

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: councilorPageUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: councilorPageUrl,
      type: 'profile',
      images: OG_IMAGE_URL,
    },
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  try {
    const { slug, districtSlug } = await params

    if (!isValidCouncil(districtSlug)) {
      notFound()
    }

    const [councilorData, topicsData] = await Promise.all([
      fetchCouncilor({ slug, districtSlug }),
      fetchCouncilorTopicsOfBill({ slug, districtSlug }),
    ])

    if (!councilorData) {
      notFound()
    }

    return (
      <CouncilorPage
        slug={slug}
        districtSlug={districtSlug}
        councilorData={councilorData}
        topicsData={topicsData}
      />
    )
  } catch (error) {
    console.error('Error fetching councilor data:', error)
    return <div>Failed to load councilor data. Please try again later.</div>
  }
}
