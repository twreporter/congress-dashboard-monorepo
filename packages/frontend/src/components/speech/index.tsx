'use client'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
// @twreporter
import {
  DesktopAndAbove,
  TabletAndBelow,
} from '@twreporter/react-components/lib/rwd'
import { Report, Video } from '@twreporter/react-components/lib/icon'
import mq from '@twreporter/core/lib/utils/media-query'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
// no yet open to public
// import { TEN_YEAR_ANNIVERSARY } from '@twreporter/core/lib/constants/feature-flag'
// styles
import {
  SpeechContainer,
  LeadingContainer,
  IvodBlock,
  IvodSwitchBlock,
  IvodSwitchButtonContainer,
  P1Gray600,
  BodyContainer,
  AsideBlock,
  ContentBlock,
  Feedback,
  ControlTabContainer,
  ControlTab,
  DateAndTitle,
  ControlTabDate,
  ControlTabTitle,
  ControlItems,
  Spacing,
} from '@/components/speech/styles'
// components
import SpeechDate from '@/components/speech/speech-date'
import SpeechTitle from '@/components/speech/speech-title'
import SpeechAsideInfo from '@/components/speech/speech-aside-info'
import SpeechAsideToolBar from '@/components/speech/speech-aside-toolbar'
import SpeechSummary from '@/components/speech/speech-summary'
import SeparationCurve from '@/components/speech/separation-curve'
import SpeechContent from '@/components/speech/speech-content'
import SpeechMobileToolbar from '@/components/speech/speech-mobile-toolbar'
import IconButton from '@/components/button/icon-button'
import CustomPillButton from '@/components/button/pill-button'
import DonationBox from '@/components/about/donation-box'
// no yet open to public
// import NewDonatonBox from '@/components/about/new-donation-box'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// type
import { type SpeechFromRes } from '@/fetchers/server/speech'
// hooks
import { useSpeechData } from '@/components/speech/hooks/use-speech-data'
import { useScrollStage } from '@/components/speech/hooks/use-scroll-stage'
// constants
import { InternalRoutes } from '@/constants/routes'
// utils
import { openFeedback } from '@/utils/feedback'

const DesktopAndAboveWithFlex = styled(DesktopAndAbove)`
  ${mq.desktopAndAbove`
    display: flex !important;
    flex: 1;
  `}
`
const TabletAndBelowWithFlex = styled(TabletAndBelow)`
  ${mq.tabletAndBelow`
    display: flex !important;
  `}
`

export enum FontSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export const FontSizeOffset = Object.freeze({
  [FontSize.SMALL]: 0,
  [FontSize.MEDIUM]: 2,
  [FontSize.LARGE]: 4,
})

export enum Direction {
  PREV = 'prev',
  NEXT = 'next',
}

// constants
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const intersectionThreshold = 0.5
// no yet open to public
// const Donation = TEN_YEAR_ANNIVERSARY ? NewDonatonBox : DonationBox
const Donation = DonationBox

type SpeechPageProps = {
  speech: SpeechFromRes
  speechGroup: string[]
}
const SpeechPage: React.FC<SpeechPageProps> = ({ speech, speechGroup }) => {
  const router = useRouter()
  const leadingRef = useRef<HTMLDivElement>(null)
  const { setTabElement, isHeaderHidden } = useScrollContext()
  const [fontSize, setFontSize] = useState(FontSize.SMALL)
  const [isControllBarHidden, setIsControllBarHidden] = useState(true)
  const scrollStage = useScrollStage()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (leadingRef.current) {
      setTabElement(leadingRef.current)
    }
  }, [setTabElement, leadingRef])

  useEffect(() => {
    if (!leadingRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsControllBarHidden(entry.isIntersecting)
      },
      {
        threshold: intersectionThreshold,
      }
    )
    observer.observe(leadingRef.current)
    return () => {
      observer.disconnect()
    }
  }, [leadingRef])

  const {
    slug,
    date,
    title,
    legislator,
    attendee,
    relatedTopics,
    summary,
    content,
    iVODLink,
  } = useSpeechData(speech)

  const isFirstSpeech = speechGroup.indexOf(slug) === 0
  const isLastSpeech = speechGroup.indexOf(slug) === speechGroup.length - 1

  const cycleFontSize = useCallback(() => {
    setFontSize((current) =>
      current === FontSize.SMALL
        ? FontSize.MEDIUM
        : current === FontSize.MEDIUM
        ? FontSize.LARGE
        : FontSize.SMALL
    )
  }, [])

  const handleSwitchSpeech = useCallback(
    (direction: Direction) => {
      const idx = speechGroup.indexOf(slug)
      if (direction === Direction.PREV && idx > 0) {
        router.push(`${InternalRoutes.Speech}/${speechGroup[idx - 1]}`)
      }
      if (direction === Direction.NEXT && idx < speechGroup.length - 1) {
        router.push(`${InternalRoutes.Speech}/${speechGroup[idx + 1]}`)
      }
    },
    [router, speechGroup, slug]
  )

  // memoize props passed repeatedly
  const asideInfoProps = useMemo(
    () => ({ legislator, attendee, relatedTopics }),
    [legislator, attendee, relatedTopics]
  )

  return (
    <SpeechContainer>
      <ControlTabContainer
        className="hidden-print"
        $isHeaderHidden={isHeaderHidden}
        $isHidden={isControllBarHidden}
      >
        <ControlTab $isHeaderAbove={!isHeaderHidden && !isControllBarHidden}>
          <DateAndTitle>
            <ControlTabDate weight={P1.Weight.BOLD} text={date} />
            <ControlTabTitle weight={P1.Weight.BOLD} text={title} />
          </DateAndTitle>
          <ControlItems>
            <CustomPillButton
              onClick={() => window.open(iVODLink, '_blank')}
              leftIconComponent={<Video releaseBranch={releaseBranch} />}
              text={'iVOD'}
            />
            <Spacing $width={24} />
            <P1Gray600 weight={P1.Weight.BOLD} text="質詢片段切換" />
            <Spacing $width={12} />
            <IconButton
              disabled={isFirstSpeech}
              direction={IconButton.Direction.LEFT}
              onClick={() => handleSwitchSpeech(Direction.PREV)}
            />
            <Spacing $width={8} />
            <IconButton
              disabled={isLastSpeech}
              direction={IconButton.Direction.RIGHT}
              onClick={() => handleSwitchSpeech(Direction.NEXT)}
            />
          </ControlItems>
        </ControlTab>
      </ControlTabContainer>
      <LeadingContainer ref={leadingRef}>
        <SpeechDate date={date} />
        <SpeechTitle title={title} />
        <DesktopAndAboveWithFlex>
          <IvodBlock>
            <CustomPillButton
              onClick={() => window.open(iVODLink, '_blank')}
              leftIconComponent={<Video releaseBranch={releaseBranch} />}
              text={'iVOD'}
            />
            <IvodSwitchBlock>
              <P1Gray600 weight={P1.Weight.BOLD} text="質詢片段切換" />
              <IvodSwitchButtonContainer>
                <IconButton
                  disabled={isFirstSpeech}
                  direction={IconButton.Direction.LEFT}
                  onClick={() => handleSwitchSpeech(Direction.PREV)}
                />
                <IconButton
                  disabled={isLastSpeech}
                  direction={IconButton.Direction.RIGHT}
                  onClick={() => handleSwitchSpeech(Direction.NEXT)}
                />
              </IvodSwitchButtonContainer>
            </IvodSwitchBlock>
          </IvodBlock>
        </DesktopAndAboveWithFlex>
      </LeadingContainer>
      <BodyContainer>
        <DesktopAndAboveWithFlex>
          <AsideBlock>
            <SpeechAsideInfo {...asideInfoProps} />
            <SpeechAsideToolBar
              onFontSizeChange={cycleFontSize}
              currentFontSize={fontSize}
            />
            <SpeechAsideInfo {...asideInfoProps} />
          </AsideBlock>
        </DesktopAndAboveWithFlex>
        <TabletAndBelowWithFlex>
          <SpeechAsideInfo {...asideInfoProps} />
        </TabletAndBelowWithFlex>
        <ContentBlock>
          <SpeechSummary
            summary={summary}
            fontSizeOffset={FontSizeOffset[fontSize]}
          />
          <SeparationCurve />
          <SpeechContent
            content={content}
            fontSizeOffset={FontSizeOffset[fontSize]}
          />
        </ContentBlock>
        <TabletAndBelowWithFlex>
          <SpeechAsideInfo {...asideInfoProps} />
        </TabletAndBelowWithFlex>
        <DesktopAndAboveWithFlex>
          <Feedback onClick={() => openFeedback('speech')}>
            <CustomPillButton
              leftIconComponent={<Report releaseBranch={releaseBranch} />}
              text={'問題回報'}
            />
          </Feedback>
        </DesktopAndAboveWithFlex>
      </BodyContainer>
      <Donation />
      <TabletAndBelow className="hidden-print">
        <SpeechMobileToolbar
          onFontSizeChange={cycleFontSize}
          iVODLink={iVODLink}
          isLastSpeech={isLastSpeech}
          isFirstSpeech={isFirstSpeech}
          onSwitchClick={handleSwitchSpeech}
          scrollStage={scrollStage}
        />
      </TabletAndBelow>
    </SpeechContainer>
  )
}

export default React.memo(SpeechPage)
