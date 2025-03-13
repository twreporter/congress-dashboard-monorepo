'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const Container = styled.section`
  display: flex;
  color: ${colorGrayscale.gray800};
  text-align: justify;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 210%;
  letter-spacing: 0.108px;
  white-space: pre-line;
`

type SpeechContentProps = {
  content: string
}
const SpeechContent: React.FC<SpeechContentProps> = ({ content }) => {
  const contentParts = content.split('\n')

  return (
    <Container>
      {contentParts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < contentParts.length - 2 ? ( // No need to add <br /> at the end
            <>
              <br />
              <br />
            </>
          ) : null}
        </React.Fragment>
      ))}
    </Container>
  )
}

export default SpeechContent
