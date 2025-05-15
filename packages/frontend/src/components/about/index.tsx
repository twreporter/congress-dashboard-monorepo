'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
// @twreporter
import Divider from '@twreporter/react-components/lib/divider'
import {
  DesktopAndAbove,
  TabletAndBelow,
} from '@twreporter/react-components/lib/rwd'
import { Report } from '@twreporter/react-components/lib/icon'
import mq from '@twreporter/core/lib/utils/media-query'
// styles
import {
  SpeechContainer,
  LeadingContainer,
  BodyContainer,
  AsideBlock,
  ContentBlock,
  Feedback,
} from '@/components/speech/styles'
// components
import SpeechSubtitle from '@/components/speech/speech-date'
import SpeechTitle from '@/components/speech/speech-title'
import SpeechAsideToolBar from '@/components/speech/speech-aside-toolbar'
import SpeechSummary from '@/components/speech/speech-summary'
import SeparationCurve from '@/components/speech/separation-curve'
import SpeechContent from '@/components/speech/speech-content'
import { AboutPageMobileToolbar } from '@/components/speech/speech-mobile-toolbar'
import CustomPillButton from '@/components/button/pill-button'
import DonationBox from '@/components/about/donation-box'
// constants
import { FontSize, FontSizeOffset } from '@/components/speech'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// hooks
import { useScrollStage } from '@/components/speech/hooks/use-scroll-stage'

const DividerWrapper = styled.div`
  ${mq.desktopAndAbove`
    padding-top: 40px;
  `}
  ${mq.tabletAndBelow`
    padding-bottom: 40px;
  `}
`

const DesktopAndAboveWithFlex = styled(DesktopAndAbove)`
  ${mq.desktopAndAbove`
    display: flex !important;
    flex: 1;
  `}
`

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const AboutPage = () => {
  const [fontSize, setFontSize] = useState(FontSize.SMALL)
  const leadingRef = useRef<HTMLDivElement>(null)
  const { setTabElement } = useScrollContext()
  const scrollStage = useScrollStage()
  // mock data
  const date = '關於觀測站'
  const title = '報導者觀測站——立委選舉結束後，監督問政內容才要開始'
  const summary =
    '「報導者觀測站」是一個立委發言觀察與監督平台，我們運用生成式AI及自然語言處理技術將數十萬筆立委的發言紀錄進行議題分類與摘要（目前起始點是從2020年第10屆立委問政開始），全面解析所有立委在任期內的問政內容與其關注焦點，讓議場上的對話不再只是即時新聞中的破碎資訊，或像卷宗般束之高閣，而是以完整、白話、近用性高的方式呈現，期待能梳理出更具透明度與公共性的公民監督立委問政方式。'
  const content =
    '「報導者觀測站」是一個立委發言觀察與監督平台，我們運用生成式AI及自然語言處理技術將數十萬筆立委的發言紀錄進行議題分類與摘要（目前起始點是從2020年第10屆立委問政開始），全面解析所有立委在任期內的問政內容與其關注焦點，讓議場上的對話不再只是即時新聞中的破碎資訊，或像卷宗般束之高閣，而是以完整、白話、近用性高的方式呈現，期待能梳理出更具透明度與公共性的公民監督立委問政方式。「報導者觀測站」是一個立委發言觀察與監督平台，我們運用生成式AI及自然語言處理技術將數十萬筆立委的發言紀錄進行議題分類與摘要（目前起始點是從2020年第10屆立委問政開始），全面解析所有立委在任期內的問政內容與其關注焦點，讓議場上的對話不再只是即時新聞中的破碎資訊，或像卷宗般束之高閣，而是以完整、白話、近用性高的方式呈現，期待能梳理出更具透明度與公共性的公民監督立委問政方式。「報導者觀測站」是一個立委發言觀察與監督平台，我們運用生成式AI及自然語言處理技術將數十萬筆立委的發言紀錄進行議題分類與摘要（目前起始點是從2020年第10屆立委問政開始），全面解析所有立委在任期內的問政內容與其關注焦點，讓議場上的對話不再只是即時新聞中的破碎資訊，或像卷宗般束之高閣，而是以完整、白話、近用性高的方式呈現，期待能梳理出更具透明度與公共性的公民監督立委問政方式。「報導者觀測站」是一個立委發言觀察與監督平台，我們運用生成式AI及自然語言處理技術將數十萬筆立委的發言紀錄進行議題分類與摘要（目前起始點是從2020年第10屆立委問政開始），全面解析所有立委在任期內的問政內容與其關注焦點，讓議場上的對話不再只是即時新聞中的破碎資訊，或像卷宗般束之高閣，而是以完整、白話、近用性高的方式呈現，期待能梳理出更具透明度與公共性的公民監督立委問政方式。「報導者觀測站」是一個立委發言觀察與監督平台，我們運用生成式AI及自然語言處理技術將數十萬筆立委的發言紀錄進行議題分類與摘要（目前起始點是從2020年第10屆立委問政開始），全面解析所有立委在任期內的問政內容與其關注焦點，讓議場上的對話不再只是即時新聞中的破碎資訊，或像卷宗般束之高閣，而是以完整、白話、近用性高的方式呈現，期待能梳理出更具透明度與公共性的公民監督立委問政方式。'

  const cycleFontSize = useCallback(() => {
    setFontSize((current) =>
      current === FontSize.SMALL
        ? FontSize.MEDIUM
        : current === FontSize.MEDIUM
        ? FontSize.LARGE
        : FontSize.SMALL
    )
  }, [])

  useEffect(() => {
    if (leadingRef.current) {
      setTabElement(leadingRef.current)
    }
  }, [setTabElement, leadingRef])

  return (
    <SpeechContainer>
      <LeadingContainer ref={leadingRef}>
        <SpeechSubtitle date={date} />
        <SpeechTitle title={title} />
      </LeadingContainer>
      <BodyContainer>
        <DesktopAndAboveWithFlex>
          <AsideBlock>
            <SpeechAsideToolBar
              onFontSizeChange={cycleFontSize}
              currentFontSize={fontSize}
            />
          </AsideBlock>
        </DesktopAndAboveWithFlex>
        <ContentBlock>
          <DividerWrapper>
            <Divider />
          </DividerWrapper>
          <SpeechSummary
            summary={summary}
            fontSizeOffset={FontSizeOffset[fontSize]}
          />
          <SeparationCurve />
          <SpeechContent
            content={content}
            fontSizeOffset={FontSizeOffset[fontSize]}
          />
          <DonationBox />
        </ContentBlock>
        <DesktopAndAboveWithFlex>
          <Feedback>
            <CustomPillButton
              leftIconComponent={<Report releaseBranch={releaseBranch} />}
              text={'問題回報'}
            />
          </Feedback>
        </DesktopAndAboveWithFlex>
      </BodyContainer>
      <TabletAndBelow className="hidden-print">
        <AboutPageMobileToolbar
          onFontSizeChange={cycleFontSize}
          scrollStage={scrollStage}
        />
      </TabletAndBelow>
    </SpeechContainer>
  )
}

export default AboutPage
