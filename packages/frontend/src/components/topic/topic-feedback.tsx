'use client'
import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// constants
import { InternalRoutes } from '@/constants/routes'

const Feedback = styled.div`
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

const TopicFeedback: React.FC = () => {
  return (
    <Feedback>
      <span>
        發現什麼問題嗎？透過
        <Link href={`${InternalRoutes.Feedback}`} target="_blank">
          問題回報
        </Link>
        告訴我們，一起讓這裡變得更好！
      </span>
    </Feedback>
  )
}

export default TopicFeedback
