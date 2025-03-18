'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { H1 } from '@twreporter/react-components/lib/text/headline'

const CustomH1 = styled(H1)`
  color: ${colorGrayscale.gray800};
  letter-spacing: 0.4px;
`

type SpeechTitleProps = {
  title: string
}
const SpeechTitle: React.FC<SpeechTitleProps> = ({ title }) => {
  return <CustomH1 text={title} />
}
export default SpeechTitle
