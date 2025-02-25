'use client'

import React from 'react'
import styled from 'styled-components'
// config
import { title, description } from '@/components/open/config'
// lib
import { notoSerif } from '@/lib/font'
// components
import SeachBar from '@/components/open/search'
import Selected from '@/components/open/selected'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'

const Box = styled.div`
  width: -webkit-fill-available;
  padding: 72px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colorGrayscale.gray200};

  ${mq.tabletOnly`
    padding: 56px 0;
  `}
  ${mq.mobileOnly`
    padding: 40px 24px;  
  `}
`
const Title = styled.div`
  font-size: 48px;
  text-alignment: center;
  color: ${colorGrayscale.gray900};

  ${mq.tabletOnly`
    font-size: 36px;  
  `}
  ${mq.mobileOnly`
    font-size: 28px;  
  `}
`
const Description = styled.div`
  color: ${colorGrayscale.gray900};
  margin-top: 24px;
  margin-bottom: 48px;
  text-align: center;

  ${mq.tabletOnly`
    margin-top: 16px;
    margin-bottom: 40px;
  `}
  ${mq.mobileOnly`
    margin-top: 16px;
    margin-bottom: 32px;
  `}
`
const StyledSelected = styled(Selected)`
  margin-top: 24px;

  ${mq.mobileOnly`
    margin-top: 16px;
  `}
`

const Open: React.FC = () => {
  const descriptJSX = description.map((text, index) => (
    <H4
      className={notoSerif.className}
      text={text}
      key={`open-desc-${index}`}
    />
  ))
  return (
    <Box>
      <Title className={notoSerif.className}>{title}</Title>
      <Description>{descriptJSX}</Description>
      <SeachBar />
      <StyledSelected />
    </Box>
  )
}

export default Open
