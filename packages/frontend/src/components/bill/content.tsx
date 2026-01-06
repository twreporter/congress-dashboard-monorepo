'use client'
import React, { isValidElement } from 'react'
import styled from 'styled-components'
// utils
import { markdownParser } from '@/utils/string-parser'
// constants
import { FontSize, FontSizeOffset } from '@/components/speech'
// style
import { Container } from '@/components/speech/speech-content'

const MarkdownContainer = styled(Container)`
  flex-direction: column;
  ul,
  ol {
    list-style-position: outside;
    margin-inline-start: 1em;
  }
`

type MarkdownContentProps = {
  content?: string
  fontSizeOffset?: number
}
const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  fontSizeOffset = FontSizeOffset[FontSize.SMALL],
}) => {
  if (!content) return null
  const nodes = markdownParser(content)

  return (
    <MarkdownContainer $fontSizeOffset={fontSizeOffset}>
      {nodes.map((node, index) =>
        isValidElement(node) ? (
          <React.Fragment key={index}>
            {node}
            {index < nodes.length - 1 ? ( // No need to add <br /> at the end
              <>
                <br />
              </>
            ) : null}
          </React.Fragment>
        ) : null
      )}
    </MarkdownContainer>
  )
}

export default MarkdownContent
