// TODO: temporary placeholder page
import React from 'react'
import { notFound } from 'next/navigation'
// constants
import { VALID_COUNCILS } from '@/constants/council'
// utils
import { isValidCouncil } from '@/utils/council'

const COUNCIL_NAMES: Record<string, string> = {
  taipei: '臺北市議會',
  'new-taipei': '新北市議會',
  taoyuan: '桃園市議會',
  taichung: '臺中市議會',
  tainan: '臺南市議會',
  kaohsiung: '高雄市議會',
}

export default async function CouncilDetailPage({
  params,
}: {
  params: Promise<{ districtSlug: string }>
}) {
  const { districtSlug } = await params

  // Validate the council districtSlug
  if (!isValidCouncil(districtSlug)) {
    notFound()
  }

  const councilName = COUNCIL_NAMES[districtSlug]

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>{councilName}</h1>
      <p>此功能開發中，敬請期待</p>
    </div>
  )
}

export async function generateStaticParams() {
  return VALID_COUNCILS.map((districtSlug) => ({
    districtSlug,
  }))
}
