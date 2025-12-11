'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { Text, Printer } from '@twreporter/react-components/lib/icon'
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
} from '@/components/speech/speech-aside-toolbar'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

const Container = styled.div`
  height: 100%;
  margin: 80px 0;
`

type AsideToolbarProps = {
  onFontSizeChange: () => void
  currentFontSize: FontSize
}
const AsideToolbar: React.FC<AsideToolbarProps> = ({
  onFontSizeChange,
  currentFontSize,
}) => {
  const onPrinterClick = () => window.print()

  return (
    <Container>
      <ToolsContainer>
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
