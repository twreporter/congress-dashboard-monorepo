'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { renderElement } from '@twreporter/react-article-components/lib/components/body'
// constants
import { FontSize, FontSizeOffset } from '@/components/speech'
// types
import { Content } from '@/components/about'

const Container = styled.section<{ $fontSizeOffset: number }>`
  display: flex;
  flex-direction: column;
  color: ${colorGrayscale.gray800};
  text-align: justify;
  font-size: ${(props) => props.$fontSizeOffset + 18}px;
  font-style: normal;
  font-weight: 400;
  line-height: 210%;
  letter-spacing: 0.108px;
  white-space: pre-line;
`

const NoPaddingX = styled.div`
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  margin-right: 0;
  & > * {
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  &:first-child {
    * {
      margin-top: 0 !important;
    }
  }
`

const InfoBoxContainer = styled.div`
  position: relative;
  height: 400px;
`

const InfoBox = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  ${mq.hdOnly`
    width: 730px;
  `}
  ${mq.desktopOnly`
    width: 550px;
  `}
  ${mq.tabletOnly`
    width: 513px;
  `}
  ${mq.mobileOnly`
    width: 100%;
    & > * {
      width: 100% !important;
    }
  `}
`

type AboutPageContentProps = {
  content: Content
  fontSizeOffset?: number
}
const AboutPageContent: React.FC<AboutPageContentProps> = ({
  content,
  fontSizeOffset = FontSizeOffset[FontSize.SMALL],
}) => {
  return (
    <Container $fontSizeOffset={fontSizeOffset}>
      {content.api_data.map((item) => {
        if (item.type === 'infobox') {
          return (
            <InfoBoxContainer key={item.id}>
              <InfoBox>{renderElement(item)}</InfoBox>
            </InfoBoxContainer>
          )
        } else {
          return <NoPaddingX key={item.id}>{renderElement(item)}</NoPaddingX>
        }
      })}
    </Container>
  )
}

export default React.memo(AboutPageContent)
