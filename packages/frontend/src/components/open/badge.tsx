'use client'

import React from 'react'
import styled from 'styled-components'
// @twreporter
import { H6 } from '@twreporter/react-components/lib/text/headline'

const Container = styled.div<{ $backgroundColor: string }>`
  padding: 2px 8px;
  border-radius: 8px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
`

const Text = styled(H6)<{ $color: string }>`
  color: ${({ $color }) => $color};
`

type BadgeProps = {
  text: string
  textColor: string
  backgroundColor: string
}
const Badge: React.FC<BadgeProps> = ({ text, textColor, backgroundColor }) => {
  return (
    <Container $backgroundColor={backgroundColor}>
      <Text $color={textColor} text={text} />
    </Container>
  )
}

export default Badge
