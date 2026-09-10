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
import { TEN_YEAR_ANNIVERSARY } from '@twreporter/core/lib/constants/feature-flag'
// styles
import {
  ArticleContainer,
  LeadingContainer,
  BodyContainer,
  AsideBlock,
  ContentBlock,
  Feedback,
} from '@/components/general-article/styles'
// components
import SpeechSubtitle from '@/components/general-article/date'
import SpeechTitle from '@/components/general-article/title'
import SpeechAsideToolBar from '@/components/general-article/aside-toolbar'
import SpeechSummary from '@/components/general-article/summary'
import SeparationCurve from '@/components/general-article/separation-curve'
import { AboutPageMobileToolbar } from '@/components/general-article/mobile-toolbar'
import CustomPillButton from '@/components/button/pill-button'
import AboutPageContent from '@/components/about/content'
import DonationBox from '@/components/about/donation-box'
import NewDonationBox from '@/components/about/new-donation-box'
// constants
import {
  FontSize,
  FontSizeOffset,
} from '@/components/general-article/constants'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// hooks
import { useScrollStage } from '@/components/general-article/hooks/use-scroll-stage'
// utils
import { openFeedback } from '@/utils/feedback'

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
    padding-bottom: 50px;
  `}
`
const Donation = TEN_YEAR_ANNIVERSARY ? NewDonationBox : DonationBox

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

  const summary = brief.api_data.flatMap((item) => item.content).join('')

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

  useEffect(() => {
    // use smooth scroll to target element when hash changes
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const id = decodeURIComponent(hash.substring(1))
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    // wait for content to be rendered before scrolling to hash
    requestAnimationFrame(() => {
      handleHashChange()
    })

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [content])

  return (
    <ArticleContainer>
      <LeadingContainer ref={leadingRef}>
        <SpeechSubtitle date={subtitle} />
        <SpeechTitle title={title} />
      </LeadingContainer>
      <BodyContainer>
        <DesktopAndAboveWithFlex>
          <AsideBlock>
            <SpeechAsideToolBar
              forAboutPage={true}
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
        </ContentBlock>
        <DesktopAndAboveWithFlex>
          <Feedback>
            <CustomPillButton
              onClick={() => openFeedback('about')}
              leftIconComponent={<Report releaseBranch={releaseBranch} />}
              text={'問題回報'}
            />
          </Feedback>
        </DesktopAndAboveWithFlex>
      </BodyContainer>
      <Donation />
      <TabletAndBelow className="hidden-print">
        <AboutPageMobileToolbar
          onFontSizeChange={cycleFontSize}
          scrollStage={scrollStage}
        />
      </TabletAndBelow>
    </ArticleContainer>
  )
}

export default AboutPage
