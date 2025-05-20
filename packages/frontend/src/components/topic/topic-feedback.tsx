'use client'
import React from 'react'
import styled from 'styled-components'
// util
import { openFeedback } from '@/utils/feedback'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'

const Container = styled.div`
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
  ${mq.tabletAndBelow`
    width: 100%;
  `}
`
const Feedback = styled.span`
  color: ${colorGrayscale.gray800};
  text-decoration: underline;
  text-decoration-color: ${colorGrayscale.gray800};
  text-underline-offset: 2px;
  cursor: pointer;
`

const TopicFeedback: React.FC = () => {
  return (
    <Container>
      <span>
        發現什麼問題嗎？透過
        <Feedback onClick={openFeedback}>問題回報</Feedback>
        告訴我們，一起讓這裡變得更好！
      </span>
    </Container>
  )
}

export default TopicFeedback
