'use client'
import React, { FC } from 'react'
import styled from 'styled-components'
// @twreporter
import { P1, P2 } from '@twreporter/react-components/lib/text/paragraph'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'

const Conatiner = styled.div`
  display: flex;
  width: 100%;
  padding: 24px;
  flex-direction: column;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid ${colorOpacity['black_0.1']};
  background-color: ${colorGrayscale.white};
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
  }
`
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
  border-bottom: 1px solid ${colorGrayscale.gray200};
`

const Label = styled(P2)`
  color: ${colorGrayscale.gray900};
`

const Title = styled(H4)`
  color: ${colorGrayscale.gray900};
  padding-top: 4px;
  ${mq.desktopAndAbove`
    font-size: 20px !important;
  `}
`

const Summary = styled(P1)`
  padding-top: 6px;
  color: ${colorGrayscale.gray800};
  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AttendeeAndDate = styled(P2)`
  color: ${colorGrayscale.gray800};
`

const FollowingArticleCardType = {
  SPEECH: 'speech',
  BILL: 'bill',
} as const
type FollowingArticleCardProps = {
  type: (typeof FollowingArticleCardType)[keyof typeof FollowingArticleCardType]
  place: string
  title: string
  summary: string
  attendee: string[]
  date: string
}
export const FollowingArticleCard: FC<FollowingArticleCardProps> & {
  Type: typeof FollowingArticleCardType
} = ({
  type = FollowingArticleCardType.SPEECH,
  place,
  title,
  summary,
  attendee,
  date,
}) => {
  const label =
    type === FollowingArticleCardType.SPEECH
      ? `發言全文｜${place}`
      : `議案｜${place}`
  const attendeeList =
    attendee.length > 1
      ? `${attendee[0]} 等 ${attendee.length - 1} 人`
      : attendee[0]
  return (
    <Conatiner>
      <ContentContainer>
        <Label text={label} />
        <Title text={title} />
        <Summary text={summary} />
      </ContentContainer>
      <AttendeeAndDate text={`${attendeeList}．發言於 ${date}`} />
    </Conatiner>
  )
}
FollowingArticleCard.Type = FollowingArticleCardType
