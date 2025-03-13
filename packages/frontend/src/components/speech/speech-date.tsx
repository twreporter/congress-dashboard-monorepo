'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import mq from '@twreporter/core/lib/utils/media-query'

const CustomP1 = styled(P1)`
  color: ${colorGrayscale.gray800};
  margin-bottom: 12px;
  font-size: 20px !important;
  ${mq.tabletAndBelow`
    font-size: 16px !important;
  `}
`

type SpeechDateProps = {
  date: string
}
const SpeechDate: React.FC<SpeechDateProps> = ({ date = '' }) => {
  return <CustomP1 weight={P1.Weight.BOLD} text={date} />
}
export default SpeechDate
