'use client'
import React, { FC } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
// @twreporter
import {
  colorOpacity,
  colorGrayscale,
  colorBrand,
} from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { TextButton } from '@twreporter/react-components/lib/button'
import { Arrow } from '@twreporter/react-components/lib/icon'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import { H5 } from '@twreporter/react-components/lib/text/headline'
// constants
import { getFollowingTabPath } from '@/components/following/constants'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

const Container = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border-radius: 4px;
  border-top: 1px solid ${colorOpacity['black_0.1']};
  border-bottom: 1px solid ${colorOpacity['black_0.1']};
  border-right: 1px solid ${colorOpacity['black_0.1']};
  background: ${colorGrayscale['white']};
  box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
  position: relative;
  ${mq.desktopAndAbove`
    padding: 24px;
  `}
`

const LeftBorder = styled.div`
  position: absolute;
  left: 0;
  top: -1px;
  bottom: -2px;
  width: 6px;
  background: ${colorBrand.dark};
  border-radius: 4px 0 0 4px;
`

const CardTitle = styled(H4)`
  display: flex;
  padding: 0 16px;
  align-items: center;
`

const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${colorGrayscale.gray200};
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border-radius: 4px;
  background: rgba(241, 241, 241, 0.5);
  cursor: pointer;
  &:hover {
    background: ${colorGrayscale.gray100};
  }
`

const SectionTitle = styled(H5)`
  color: ${colorGrayscale.gray900};
`

const SectionDescription = styled.div`
  display: flex;
  flex-direction: column;
  color: ${colorGrayscale.gray800};
`

const ButtonContainer = styled.div`
  display: flex;
  padding: 0 16px;
`

const EmptyState = styled(P1)`
  padding: 0 16px;
  color: ${colorGrayscale.gray800};
`

const TYPE = {
  COMBO: 'combo',
  TOPIC: 'topic',
} as const
type FollowingInfo = {
  title: string
  description: string
  billCount?: number
  speechCount?: number
  latestDataDate: string
}
type FollowingComboCardProps = {
  type: (typeof TYPE)[keyof typeof TYPE]
  count: number
  followingInfos: FollowingInfo[]
}
export const FollowingComboCard: FC<FollowingComboCardProps> & {
  Type: typeof TYPE
} = ({ type = TYPE.COMBO, count = 0, followingInfos = [] }) => {
  const router = useRouter()
  const title =
    type === TYPE.COMBO ? `人物 ✕ 議題 (${count})` : `議題 (${count})`
  const buttonText = type === TYPE.COMBO ? '查看全部組合' : '查看全部議題'
  const tabKey = type === TYPE.COMBO ? 'following-combo' : 'following-topic'
  const icon = (
    <Arrow direction={Arrow.Direction.RIGHT} releaseBranch={releaseBranch} />
  )
  return (
    <Container>
      <LeftBorder />
      <CardTitle text={title} type={H4.Type.ARTICLE} />
      {followingInfos.length ? (
        <>
          <SectionList>
            {followingInfos.map((info, index) => (
              <Section key={index}>
                <SectionTitle text={info.title} />
                <SectionDescription>
                  <P1 text={info.description} />
                  <P1
                    text={`共 ${info.speechCount ?? 0} 筆發言、${
                      info.billCount ?? 0
                    } 筆議案｜最新資料：${info.latestDataDate}`}
                  />
                </SectionDescription>
              </Section>
            ))}
          </SectionList>
          <ButtonContainer>
            <TextButton
              text={buttonText}
              rightIconComponent={icon}
              onClick={() => router.push(getFollowingTabPath(tabKey))}
            />
          </ButtonContainer>
        </>
      ) : (
        <EmptyState text="目前尚無追蹤的項目" />
      )}
    </Container>
  )
}
FollowingComboCard.Type = TYPE
