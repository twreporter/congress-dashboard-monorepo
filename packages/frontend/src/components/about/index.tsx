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
import { AboutPageMobileToolbar } from '@/components/speech/speech-mobile-toolbar'
import CustomPillButton from '@/components/button/pill-button'
import AboutPageContent from '@/components/about/content'
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
export type Content = {
  api_data: {
    alignment: string
    content: string[]
    id: string
    style: object
    type: string
  }[]
}
type AboutPageProps = {
  title: string
  subtitle: string
  brief: Content
  content: Content
}
const AboutPage: React.FC<AboutPageProps> = ({
  title,
  subtitle,
  brief,
  content,
}) => {
  const [fontSize, setFontSize] = useState(FontSize.SMALL)
  const leadingRef = useRef<HTMLDivElement>(null)
  const { setTabElement } = useScrollContext()
  const scrollStage = useScrollStage()

  const summary = brief.api_data
    .map((item) => {
      const { content } = item
      return content
    })
    .concat()
    .toString()

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
        <SpeechSubtitle date={subtitle} />
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
          <AboutPageContent
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
