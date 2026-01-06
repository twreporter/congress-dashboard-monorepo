'use client'
import React from 'react'
import styled, { css } from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import {
  Text,
  Printer,
  Facebook,
  Twitter,
  Line,
} from '@twreporter/react-components/lib/icon'
// types
import { FontSize } from '@/components/speech'

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
export function changeFontSizeToPct(fontSize: FontSize): string {
  switch (fontSize) {
    case FontSize.MEDIUM: {
      return '110%'
    }
    case FontSize.LARGE: {
      return '120%'
    }
    case FontSize.SMALL:
    default: {
      return '100%'
    }
  }
}

export const Container = styled.div<{ $forAboutPage?: boolean }>`
  height: 100%;
  margin: ${(props) => (props.$forAboutPage ? '0' : '80px 0')};
`

export const ToolsContainer = styled.div`
  position: sticky;
  top: 40%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: fit-content;
  align-items: center;
`

export const iconBlockCSS = css`
  position: relative;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
    background-color: ${colorGrayscale.gray600};
  }
  &::after {
    position: absolute;
    top: 5px;
    left: 34px;
    color: ${colorGrayscale.gray800};
    font-size: 10px;
    visibility: hidden;
    width: 100px;
  }
  &:hover {
    svg {
      background-color: ${colorGrayscale.gray800};
    }
    &::after {
      visibility: visible;
    }
  }
`

export const TextIconBlock = styled.div<{ $currentFontSize: FontSize }>`
  ${iconBlockCSS}
  &::after {
    content: '字級大小${(props) =>
      changeFontSizeToPct(props.$currentFontSize)}';
  }
`

export const PrintIconBlock = styled.div`
  ${iconBlockCSS}
  &::after {
    content: '列印';
  }
`

export const SourceIconBlock = styled.div`
  ${iconBlockCSS}
  &::after {
    content: '資料來源';
  }
`

export const ShareIconBlock = styled.div`
  width: 30px;
  height: 30px;
  svg {
    width: 18px;
    height: 18px;
    background-color: ${colorGrayscale.gray800};
  }
  background-color: ${colorGrayscale.white};
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  display: flex;
`

export const FBShareBT: React.FC = () => {
  const appID = '962589903815787'
  const handleClick = () => {
    const currentURL = window.location.href
    const location =
      'https://www.facebook.com/dialog/feed?' +
      'display=page' +
      `&app_id=${appID}` +
      `&link=${encodeURIComponent(currentURL)}` +
      `&redirect_uri=${encodeURIComponent('https://www.facebook.com/')}`

    window.open(location, '_blank')
  }

  return (
    <ShareIconBlock id="fb-share">
      <Facebook onClick={handleClick} releaseBranch={releaseBranch} />
    </ShareIconBlock>
  )
}

export const TwitterShareBT: React.FC = () => {
  const handleClick = () => {
    const currentURL = window.location.href
    const location =
      'https://twitter.com/intent/tweet?' +
      `url=${encodeURIComponent(currentURL)}&text=${encodeURIComponent(
        document.title + ' #報導者'
      )}`

    window.open(location, '_blank')
  }

  return (
    <ShareIconBlock id="twitter-share">
      <Twitter onClick={handleClick} releaseBranch={releaseBranch} />
    </ShareIconBlock>
  )
}

export const LineShareBT: React.FC = () => {
  const handleClick = () => {
    const currentURL = window.location.href
    const location = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
      currentURL
    )}`

    window.open(location, '_blank')
  }

  return (
    <ShareIconBlock id="line-share">
      <Line onClick={handleClick} releaseBranch={releaseBranch} />
    </ShareIconBlock>
  )
}

type AsideToolbarProps = {
  onFontSizeChange: () => void
  currentFontSize: FontSize
  forAboutPage?: boolean
}
const AsideToolbar: React.FC<AsideToolbarProps> = ({
  onFontSizeChange,
  currentFontSize,
  forAboutPage = false,
}) => {
  const onPrinterClick = () => window.print()

  return (
    <Container $forAboutPage={forAboutPage}>
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
