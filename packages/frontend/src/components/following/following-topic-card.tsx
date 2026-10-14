'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import { P1, P2 } from '@twreporter/react-components/lib/text/paragraph'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 24px;
  flex-direction: column;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid ${colorOpacity['black_0.1']};
  background: ${colorGrayscale.white};
  cursor: pointer;
  &:hover {
    border-color: ${colorOpacity['black_0.2']};
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
  border-bottom: 1px solid ${colorGrayscale.gray200};
`

const CardType = styled.div`
  display: flex;
  flex-direction: row;
  color: ${colorGrayscale.gray900};
`

const CardTitle = styled(H4)`
  margin-top: 4px;
  color: ${colorGrayscale.gray900};
`

const CardDescription = styled.div`
  display: flex;
  flex-direction: column;
  color: ${colorGrayscale.gray800};
  padding-top: 6px;
`

const LatestDataDate = styled(P2)`
  color: ${colorGrayscale.gray800};
`

enum TOPIC_TYPE {
  COMBO = 'combo',
  TOPIC = 'topic',
}
enum TYPE {
  LEGISLATIVE = 'legislative',
  LOCAL = 'local',
}
type FollowingTopicCardProps = {
  topicType: TOPIC_TYPE
  type: TYPE
  title: string
  description: string
  billCount: number
  speechCount?: number
  latestDataDate: string
  district?: string
}
export const FollowingTopicCard: FC<FollowingTopicCardProps> & {
  TopicType: typeof TOPIC_TYPE
  Type: typeof TYPE
} = ({
  topicType = TOPIC_TYPE.COMBO,
  type = TYPE.LEGISLATIVE,
  title,
  description,
  billCount,
  speechCount,
  latestDataDate,
  district = '',
}) => {
  const cardTopicTypeText =
    topicType === TOPIC_TYPE.COMBO ? '人物 ✕ 議題' : '議題'
  const cardTypeText = type === TYPE.LEGISLATIVE ? '立法院' : `${district}議會`
  return (
    <Container>
      <Content>
        <CardType>
          <P2
            weight={P2.Weight.BOLD}
            text={`${cardTopicTypeText} | ${cardTypeText}`}
          />
        </CardType>
        <CardTitle text={title} />
        <CardDescription>
          <P1 text={description} />
          <P1
            text={`共 ${speechCount ?? 0} 筆發言、${billCount ?? 0} 筆議案`}
          />
        </CardDescription>
      </Content>
      <LatestDataDate text={`最新資料：${latestDataDate}`} />
    </Container>
  )
}
FollowingTopicCard.TopicType = TOPIC_TYPE
FollowingTopicCard.Type = TYPE
