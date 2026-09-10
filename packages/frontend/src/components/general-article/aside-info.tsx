import React from 'react'
import styled from 'styled-components'
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'

export const AsideInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  border-top: 1px solid ${colorGrayscale.gray300};
  border-bottom: 1px solid ${colorGrayscale.gray300};
  padding: 24px 0;
  position: relative;
  width: 100%;
  &::before,
  &::after {
    content: '';
    border-right: 0.5px solid ${colorGrayscale.gray300};
    width: 1px;
    height: 12px;
    right: 0;
    position: absolute;
  }
  &::before {
    top: 0;
  }
  &::after {
    bottom: 0;
  }
`

export const PersonAndAttendeeBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const PersonBlock = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      text-decoration-color: ${colorSupportive.heavy};
    }
  }
`

export const PersonLabel = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
`

export const IssueTagsBlock = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  a {
    text-decoration: none;
  }
  ${mq.desktopOnly`
    flex-direction: column;
  `}
`

export const SlashIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
  >
    <path d="M1.28 12.5L14.72 1.5" stroke="#C09662" strokeLinecap="square" />
  </svg>
)
