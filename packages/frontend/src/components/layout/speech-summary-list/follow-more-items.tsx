import React, { ReactNode } from 'react'
// common components
import {
  FollowMoreSection,
  FollowMoreTitle,
} from '@/components/layout/speech-summary-list/layout'

type FollowMoreItemsProps = {
  title: string
  children: ReactNode
}
const FollowMoreItems = React.memo<FollowMoreItemsProps>(
  ({ title, children }) => {
    return (
      <FollowMoreSection>
        <FollowMoreTitle text={title} />
        {children}
      </FollowMoreSection>
    )
  }
)

FollowMoreItems.displayName = 'FollowMoreItems'

export default FollowMoreItems
