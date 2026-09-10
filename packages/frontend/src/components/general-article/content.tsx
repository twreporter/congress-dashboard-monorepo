'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
// constants
import {
  FontSize,
  FontSizeOffset,
} from '@/components/general-article/constants'

export const Container = styled.section<{ $fontSizeOffset: number }>`
  display: flex;
  color: ${colorGrayscale.gray800};
  text-align: justify;
  font-size: ${(props) => props.$fontSizeOffset + 18}px;
  font-style: normal;
  font-weight: 400;
  line-height: 210%;
  letter-spacing: 0.108px;
  white-space: pre-line;
`

type ContentProps = {
  content: string
  fontSizeOffset?: number
}
const Content: React.FC<ContentProps> = ({
  content,
  fontSizeOffset = FontSizeOffset[FontSize.SMALL],
}) => {
  // replace both \n & \\n to work around the issue of content from CSV having real newlines
  const contentParts = content.split(/\\n|\n/g)

  return (
    <Container $fontSizeOffset={fontSizeOffset}>
      {contentParts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < contentParts.length - 1 ? ( // No need to add <br /> at the end
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

export default Content
