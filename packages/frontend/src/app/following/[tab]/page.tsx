import { notFound } from 'next/navigation'
import { Following } from '@/components/following'
import {
  FOLLOWING_TAB_KEYS,
  isFollowingTabKey,
} from '@/components/following/constants'

export function generateStaticParams() {
  return FOLLOWING_TAB_KEYS.map((tab) => ({ tab }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ tab: string }>
}) {
  const { tab } = await params

  if (!isFollowingTabKey(tab)) {
    notFound()
  }

  return <Following selectedTab={tab} />
}
