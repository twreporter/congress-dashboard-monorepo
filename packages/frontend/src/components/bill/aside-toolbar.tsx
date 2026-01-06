'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { Text, Printer, Source } from '@twreporter/react-components/lib/icon'
// types
import type { FontSize } from '@/components/speech'
// components
import {
  FBShareBT,
  TwitterShareBT,
  LineShareBT,
} from '@/components/speech/speech-aside-toolbar'
// style
import {
  ToolsContainer,
  TextIconBlock,
  PrintIconBlock,
  SourceIconBlock,
} from '@/components/speech/speech-aside-toolbar'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

const Container = styled.div`
  height: 100%;
  margin-top: 80px;
`

type AsideToolbarProps = {
  onFontSizeChange: () => void
  currentFontSize: FontSize
  sourceLink: string
}
const AsideToolbar: React.FC<AsideToolbarProps> = ({
  onFontSizeChange,
  currentFontSize,
  sourceLink,
}) => {
  const onPrinterClick = () => window.print()
  const goToSourceLink = () => window.open(sourceLink, '_blank')

  return (
    <Container>
      <ToolsContainer>
        <SourceIconBlock>
          <Source onClick={goToSourceLink} releaseBranch={releaseBranch} />
        </SourceIconBlock>
        <TextIconBlock $currentFontSize={currentFontSize}>
          <Text onClick={onFontSizeChange} releaseBranch={releaseBranch} />
        </TextIconBlock>
        <PrintIconBlock>
          <Printer onClick={onPrinterClick} releaseBranch={releaseBranch} />
        </PrintIconBlock>
        <FBShareBT />
        <TwitterShareBT />
        <LineShareBT />
      </ToolsContainer>
    </Container>
  )
}
export default AsideToolbar
