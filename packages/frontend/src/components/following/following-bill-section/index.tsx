'use client'
import React from 'react'
// constants
import {
  FOLLOWING_TAB,
  getFollowingTabPath,
} from '@/components/following/constants'
// styles
import { TabPlaceholder } from '@/components/following/section/styles'

export const FollowingBillSection = () => {
  return <TabPlaceholder text={getFollowingTabPath(FOLLOWING_TAB.BILL)} />
}
