'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { H1 } from '@twreporter/react-components/lib/text/headline'
import { P1, P2 } from '@twreporter/react-components/lib/text/paragraph'

export const SpeechContainer = styled.div`
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

export const P1Gray600 = styled(P1)`
  color: ${colorGrayscale.gray600};
`

export const P1SupportiveHeavy = styled(P1)`
  color: ${colorSupportive.heavy};
`

export const P2Gray600 = styled(P2)`
  color: ${colorGrayscale.gray600};
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

export const VideoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M10.275 16L15.85 12.425C16 12.325 16.075 12.1833 16.075 12C16.075 11.8167 16 11.675 15.85 11.575L10.275 8C10.1083 7.88333 9.9375 7.875 9.7625 7.975C9.5875 8.075 9.5 8.225 9.5 8.425V15.575C9.5 15.775 9.5875 15.925 9.7625 16.025C9.9375 16.125 10.1083 16.1167 10.275 16ZM4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM4 18H20V6H4V18Z"
      fill="#808080"
    />
  </svg>
)

export const FeedbackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 17C12.2833 17 12.5208 16.9042 12.7125 16.7125C12.9042 16.5208 13 16.2833 13 16C13 15.7167 12.9042 15.4792 12.7125 15.2875C12.5208 15.0958 12.2833 15 12 15C11.7167 15 11.4792 15.0958 11.2875 15.2875C11.0958 15.4792 11 15.7167 11 16C11 16.2833 11.0958 16.5208 11.2875 16.7125C11.4792 16.9042 11.7167 17 12 17ZM12 13C12.2833 13 12.5208 12.9042 12.7125 12.7125C12.9042 12.5208 13 12.2833 13 12V8C13 7.71667 12.9042 7.47917 12.7125 7.2875C12.5208 7.09583 12.2833 7 12 7C11.7167 7 11.4792 7.09583 11.2875 7.2875C11.0958 7.47917 11 7.71667 11 8V12C11 12.2833 11.0958 12.5208 11.2875 12.7125C11.4792 12.9042 11.7167 13 12 13ZM9.075 21C8.80833 21 8.55417 20.95 8.3125 20.85C8.07083 20.75 7.85833 20.6083 7.675 20.425L3.575 16.325C3.39167 16.1417 3.25 15.9292 3.15 15.6875C3.05 15.4458 3 15.1917 3 14.925V9.075C3 8.80833 3.05 8.55417 3.15 8.3125C3.25 8.07083 3.39167 7.85833 3.575 7.675L7.675 3.575C7.85833 3.39167 8.07083 3.25 8.3125 3.15C8.55417 3.05 8.80833 3 9.075 3H14.925C15.1917 3 15.4458 3.05 15.6875 3.15C15.9292 3.25 16.1417 3.39167 16.325 3.575L20.425 7.675C20.6083 7.85833 20.75 8.07083 20.85 8.3125C20.95 8.55417 21 8.80833 21 9.075V14.925C21 15.1917 20.95 15.4458 20.85 15.6875C20.75 15.9292 20.6083 16.1417 20.425 16.325L16.325 20.425C16.1417 20.6083 15.9292 20.75 15.6875 20.85C15.4458 20.95 15.1917 21 14.925 21H9.075ZM9.1 19H14.9L19 14.9V9.1L14.9 5H9.1L5 9.1V14.9L9.1 19Z"
      fill="#808080"
    />
  </svg>
)

export const Feedback = styled.div`
  position: sticky;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  height: 42px;
  top: calc(100% - 42px - 24px); // 42px for height and 24px for padding
`
