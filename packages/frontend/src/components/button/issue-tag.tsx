'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'

const Container = styled.div`
  display: flex;
  width: fit-content;
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  border: 1px solid ${colorGrayscale.gray600};
  color: ${colorGrayscale.gray600};
  cursor: pointer;
  &:hover {
    background-color: ${colorGrayscale.white};
  }
`

type IssueTagProps = {
  text: string
}
const IssueTag: React.FC<IssueTagProps> = ({ text = '' }) => {
  const displayText = text.length > 10 ? `${text.substring(0, 10)}...` : text
  return (
    <Container>
      <P2 text={`#${displayText}`} />
    </Container>
  )
}

export default IssueTag
