'use client'
import styled from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { H1 } from '@twreporter/react-components/lib/text/headline'
import { P1, P2 } from '@twreporter/react-components/lib/text/paragraph'
// constants
import { HEADER_HEIGHT } from '@/constants/header'
// z-index
import { ZIndex } from '@/styles/z-index'

export const SpeechContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${colorGrayscale.gray100};
  ${mq.hdOnly`
    padding: 48px 80px 120px;
  `}
  ${mq.desktopOnly`
    padding: 48px 48px 120px;
  `}
  ${mq.tabletOnly`
    padding: 32px 48px 80px;
  `}
  ${mq.mobileOnly`
    padding: 32px 24px 80px;
  `}
`

export const LeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  ${mq.hdOnly`
    width: 580px;
  `}
  ${mq.desktopOnly`
    width: 480px;
  `}
  ${mq.tabletOnly`
    width: 480px;
  `};
`

export const SpeechDate = styled.div`
  color: ${colorGrayscale.gray800};
  margin-bottom: 12px;
`

export const SpeechTitle = styled(H1)`
  color: ${colorGrayscale.gray800};
`

export const IvodBlock = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 40px;
  border-top: 1px solid ${colorGrayscale.gray300};
  border-bottom: 1px solid ${colorGrayscale.gray300};
  padding: 16px 0;
`

export const IvodSwitchBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`

export const IvodSwitchButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`

export const BodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  gap: 100px;
  position: relative;
  ${mq.desktopAndBelow`
    gap: 40px;
    max-width: 928px;
  `}
  ${mq.tabletAndBelow`
    flex-direction: column;
    width: 480px;
    margin-top: 40px;
  `}
  ${mq.mobileOnly`
    width: 100%;
  `}
`

export const AsideBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${mq.hdOnly`
    width: 250px;
  `}
  ${mq.desktopOnly`
    width: 190px;
  `}
  ${mq.tabletAndBelow`
    width: 100%;
    gap: 40px;
  `}
`

export const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  ${mq.hdOnly`
    width: 580px;
  `}
  ${mq.desktopOnly`
    width: 480px;
  `}
  ${mq.tabletOnly`
    width: 480px;
  `};
`

export const Feedback = styled.div`
  position: sticky;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  height: 42px;
  top: calc(100% - 42px - 24px); // 42px for height and 24px for padding
`

export const ControlTabContainer = styled.div<{
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
  left: 0;
  display: flex;
  width: 100%;
  height: 64px;
  background-color: ${colorGrayscale.gray100};
  ${mq.desktopOnly`
    padding: 0 48px;
  `}
  ${mq.tabletOnly`
    padding: 0 32px;
  `}
`

export const ControlTab = styled.div<{ $isHeaderAbove?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 80px;
  justify-content: space-between;
  padding: 12px 16px;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid ${colorGrayscale.gray300};
  border-top: ${(props) =>
    props.$isHeaderAbove ? `1px solid ${colorGrayscale.gray300}` : 'none'};
  ${mq.hdOnly`
    max-width: 1280px;
    margin: 0 auto;
  `}
  ${mq.mobileOnly`
    padding: 16px 24px;
  `}
`

export const DateAndTitle = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  ${mq.mobileOnly`
    width: 100%;
  `}
`

export const ControlItems = styled.div`
  display: flex;
  flex-direction: row;
`

export const Spacing = styled.div<{ $width?: number; $height?: number }>`
  width: ${(props) => (props.$width ? props.$width : 0)}px;
  height: ${(props) => (props.$height ? props.$height : 0)}px;
`

// Text
export const P1Gray600 = styled(P1)`
  color: ${colorGrayscale.gray600};
`

export const P1SupportiveHeavy = styled(P1)`
  color: ${colorSupportive.heavy};
`

export const P2Gray600 = styled(P2)`
  color: ${colorGrayscale.gray600};
`

export const ControlTabDate = styled(P1)`
  color: ${colorGrayscale.gray800};
  flex: 0;
`

export const ControlTabTitle = styled(P1)`
  color: ${colorGrayscale.gray800};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block !important; // for text ellipsis
  margin: auto 0 !important;
`
