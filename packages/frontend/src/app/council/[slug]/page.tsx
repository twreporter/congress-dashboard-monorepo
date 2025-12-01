// TODO: temporary placeholder page
import React from 'react'
import { notFound } from 'next/navigation'

const VALID_COUNCILS = [
  'taipei',
  'new-taipei',
  'taoyuan',
  'taichung',
  'tainan',
  'kaohsiung',
]

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
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Validate the council slug
  if (!VALID_COUNCILS.includes(slug)) {
    notFound()
  }

  const councilName = COUNCIL_NAMES[slug]

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>{councilName}</h1>
      <p>此功能開發中，敬請期待</p>
    </div>
  )
}

export async function generateStaticParams() {
  return VALID_COUNCILS.map((slug) => ({
    slug,
  }))
}
