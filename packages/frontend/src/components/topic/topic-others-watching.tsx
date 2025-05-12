'use client'
import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// components
import { H4Title } from '@/components/topic/styles'
import { Issue } from '@/components/sidebar/follow-more'
// constants
import { InternalRoutes } from '@/constants/routes'

const OthersWatchingBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 20px;
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

const TopicsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  a {
    text-decoration: none;
  }
`

type TopicOthersWatchingProps = {
  othersWatchingTags?: {
    title: string
    slug: string
  }[]
  currentMeetingTerm: number
  currentMeetingSession: number[]
}

const TopicOthersWatching: React.FC<TopicOthersWatchingProps> = ({
  othersWatchingTags = [],
  currentMeetingTerm,
  currentMeetingSession,
}) => {
  return othersWatchingTags.length > 0 ? (
    <OthersWatchingBlock>
      <H4Title text="其他人也在關注" />
      <TopicsContainer>
        {othersWatchingTags.map((tag, index) => (
          <Link
            href={`${InternalRoutes.Topic}/${
              tag.slug
            }?meetingTerm=${currentMeetingTerm}&sessionTerm=${JSON.stringify(
              currentMeetingSession
            )}`}
            key={`others-watching-tag-${index}`}
          >
            <Issue name={`#${tag.title}`} slug={tag.slug} />
          </Link>
        ))}
      </TopicsContainer>
    </OthersWatchingBlock>
  ) : null
}

export default TopicOthersWatching
