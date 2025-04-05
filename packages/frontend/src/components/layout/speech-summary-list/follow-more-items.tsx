import React, { ReactNode } from 'react'
import styled from 'styled-components'
// common components
import {
  FollowMoreSection,
  FollowMoreTitle,
} from '@/components/layout/speech-summary-list/layout'

interface FollowMoreItemsProps {
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

// Styled components for different container types
export const LegislatorContainer = styled.div`
  gap: 32px;
  display: flex;
  overflow-x: scroll;
  a {
    text-decoration: none;
  }
`

export const TopicContainer = styled.div`
  gap: 12px;
  display: flex;
  flex-wrap: wrap;
  a {
    text-decoration: none;
  }
`

export default FollowMoreItems
