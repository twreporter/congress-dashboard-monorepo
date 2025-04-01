'use client'
import styled from 'styled-components'
// @gtwreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { H1, H4, H6 } from '@twreporter/react-components/lib/text/headline'
import {P1, P3} from '@twreporter/react-components/lib/text/paragraph'
// utils
import { notoSerif } from '@/utils/font'

export const TopicWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${colorGrayscale.gray100};
  padding-top: 48px;
  padding-bottom: 120px;
  align-items: center;
  ${mq.desktopOnly`
    padding-left: 48px;
    padding-right: 48px;
  `}
  ${mq.tabletOnly`
    padding: 32px 32px 80px;
  `}
  ${mq.mobileOnly`
    padding: 32px 24px 80px;
  `}
`

export const TopicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${mq.hdOnly`
    width: 1120px;
  `}
  ${mq.desktopOnly`
    max-width: 1016px; // 720 + 272 + 24
  `}
`

export const LeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${mq.mobileOnly`
    flex-direction: column;
    gap: 20px;
  `}
`

export const FilterBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  ${mq.mobileOnly`
    justify-content: space-between;
  `}
`

export const Spacing = styled.div<{ $width?: number; $height?: number }>`
  width: ${(props) => (props.$width ? props.$width : 0)}px;
  height: ${(props) => (props.$height ? props.$height : 0)}px;
`

export const ContentBlock = styled.div`
  display: flex;
  flex-direction: row;
  ${mq.desktopAndAbove`
    gap: 24px;
  `}
  ${mq.tabletAndBelow`
    width: 100%;
    flex-direction: column;
  `}
`

export const TopicListContainer = styled.div`
  display: flex;
  border-radius: 8px;
  background-color: ${colorGrayscale.white};
  ${mq.hdOnly`
    width: 796px;
  `}
  ${mq.desktopOnly`
    max-width: 720px;
  `}
  ${mq.tabletAndBelow`
    border-radius: 0;
  `}
  ${mq.tabletOnly`
    margin-left: -32px;
    margin-right: -32px;
  `}
  ${mq.mobileOnly`
    margin-left: -24px;
    margin-right: -24px;
  `}
`

export const DesktopAside = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 0 0 auto;
  ${mq.hdOnly`
    width: 300px;
  `}
  ${mq.desktopOnly`
    width: 272px;
  `}
  ${mq.tabletAndBelow`
    display: none;
  `}
`

export const StatisticsBlock = styled.div`
  display: flex;
  padding: 32px 24px;
  border-radius: 8px;
  background-color: ${colorGrayscale.white};
  justify-content: space-between;
  gap: 20px;
  ${mq.tabletAndBelow`
    width: 100%;
  `}
`

export const StatisticsDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`

export const RelatedArticleBlock = styled.div`
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

export const OthersWatchingBlock = styled.div`
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

export const OthersWatchingTags = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
  a {
    text-decoration: none;
  }
`

export const Feedback = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px;
  border-radius: 8px;
  background-color: ${colorGrayscale.gray200};
  span {
    color: ${colorGrayscale.gray800};
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
  }
  a {
    color: ${colorGrayscale.gray800};
    text-decoration-color: ${colorGrayscale.gray800};
  }
  ${mq.tabletAndBelow`
    width: 100%;
  `}
`

// text
export const TopicTitle = styled(H1)`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`

export const P1Gray700 = styled(P1)`
  color: ${colorGrayscale.gray700};
`

export const P1Gray800 = styled(P1)`
  color: ${colorGrayscale.gray800};
`

export const StatisticsNumber = styled.div`
  color: ${colorGrayscale.gray800};
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
`

export const H4Title = styled(H4)`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`

export const H6Gray900 = styled(H6)`
  color: ${colorGrayscale.gray900};
`

export const P3Gray600 = styled(P3)`
  color: ${colorGrayscale.gray600};
`