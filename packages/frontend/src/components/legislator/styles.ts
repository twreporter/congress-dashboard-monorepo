'use client'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { H3 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
// utils
import { notoSerif } from '@/utils/font'

export const LegislatorWrapper = styled.div`
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

export const ContentBlock = styled.div`
  display: flex;
  gap: 24px;
  ${mq.tabletAndBelow`
    flex-direction: column;
  `}
`

export const DesktopContainer = styled.div`
  display: flex;
  gap: 24px;
`

export const DesktopAsideLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

export const DesktopAsideRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  ${mq.desktopOnly`
    max-width: 720px;
  `}
  ${mq.tabletAndBelow`
    display: none;
  `}
`

export const ListContainer = styled.div`
  display: flex;
  border-radius: 8px;
  background-color: ${colorGrayscale.white};
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

// text
export const H3Gray900 = styled(H3)`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`

export const P1Gray800 = styled(P1)`
  color: ${colorGrayscale.gray800};
`
