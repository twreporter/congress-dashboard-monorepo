'use client'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { H1, H3, H5 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
// constants
import { HEADER_HEIGHT } from '@/constants/header'
// z-index
import { ZIndex } from '@/styles/z-index'
// utils
import { notoSerif } from '@/utils/font'
// cheetsheet
import { textOverflowEllipsisCss } from '@/styles/cheetsheet'

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

export const LegislatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1120px;
  gap: 32px;
`

export const LeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 64px;
  ${mq.tabletOnly`
    gap: 32px;
  `}
  ${mq.mobileOnly`
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  `}
`

export const FilterBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex: none;
  align-self: flex-end;
  ${mq.mobileOnly`
    width: 100%;
    justify-content: space-between;
  `}
`

export const ContentBlock = styled.div`
  display: flex;
  gap: 24px;
  ${mq.tabletAndBelow`
    flex-direction: column;
  `}
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

export const FunctionBarWrapper = styled.div<{
  $isHeaderHidden?: boolean
  $isHidden?: boolean
}>`
  z-index: ${ZIndex.ControlBar};
  position: fixed;
  top: ${(props) =>
    props.$isHidden
      ? '-64px'
      : props.$isHeaderHidden
      ? '0'
      : `${HEADER_HEIGHT}px`};
  transform: ${(props) =>
    props.$isHidden ? 'translateY(-100%)' : 'translateY(0)'};
  transition: all 300ms ease-in-out;
  width: 100%;
  display: flex;
  background-color: ${colorGrayscale.gray100};
  border-top: 1px solid ${colorGrayscale.gray300};
  border-bottom: 1px solid ${colorGrayscale.gray300};
  ${mq.hdOnly`
    width: 1280px;
    margin: auto;
  `}
  ${mq.desktopOnly`
    padding: 0 48px;
  `}
  ${mq.tabletOnly`
    padding: 0 32px;
  `}
  ${mq.mobileOnly`
    padding: 0 24px;
  `}
`

export const FunctionBar = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  gap: 80px;
  ${mq.tabletOnly`
    gap: 48px;
  `}
  ${mq.mobileOnly`
    gap: 20px;
    padding: 12px 0;
  `}
  ${FilterBar} {
    ${mq.mobileOnly`
      width: auto;
    `}
  }
`

// text
export const LegislatorTitle = styled(H1)`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`

export const P1Gray700 = styled(P1)`
  color: ${colorGrayscale.gray700};
`

export const H3Gray900 = styled(H3)`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`

export const P1Gray800 = styled(P1)`
  color: ${colorGrayscale.gray800};
`

export const FunctionBarTitle = styled(H5)`
  ${textOverflowEllipsisCss}
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`
