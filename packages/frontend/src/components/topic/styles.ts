'use client'
import styled from 'styled-components'
// @gtwreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { H4, H6 } from '@twreporter/react-components/lib/text/headline'
import { P1, P3 } from '@twreporter/react-components/lib/text/paragraph'
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

// text
export const P1Gray800 = styled(P1)`
  color: ${colorGrayscale.gray800};
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
