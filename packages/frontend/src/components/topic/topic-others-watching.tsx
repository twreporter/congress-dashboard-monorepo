'use client'
import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// components
import { Issue } from '@/components/sidebar/followMore'
import { H4Title } from '@/components/topic/styles'
// mockData
import { othersWatchingTags } from '@/components/topic/mockData'

const OthersWatchingBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border-radius: 8px;
  background-color: ${colorGrayscale.white};
  ${mq.tabletOnly`
    margin-left: -32px;
    margin-right: -32px;
    padding-left: 32px;
    padding-right: 32px;
  `}
  ${mq.mobileOnly`
    margin-left: -24px;
    margin-right: -24px;
    padding-left: 24px;
    padding-right: 24px;
  `}
`

const OthersWatchingTags = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
  a {
    text-decoration: none;
  }
`

type TopicOthersWatchingProps = {
  currentMeetingTerm: number
  currentMeetingSession: number[]
}

const TopicOthersWatching: React.FC<TopicOthersWatchingProps> = ({
  currentMeetingTerm,
  currentMeetingSession,
}) => {
  return (
    <OthersWatchingBlock>
      <H4Title text="其他人也在看" />
      <OthersWatchingTags>
        {othersWatchingTags.map((topic, idx) => (
          <Link
            href={`/topics/${
              topic.slug
            }?meetingTerm=${currentMeetingTerm}&sessionTerm=${JSON.stringify(
              currentMeetingSession
            )}`}
            key={`issue-tag-${idx}-${topic.slug}`}
          >
            <Issue name={topic.title} />
          </Link>
        ))}
      </OthersWatchingTags>
    </OthersWatchingBlock>
  )
}

export default TopicOthersWatching
