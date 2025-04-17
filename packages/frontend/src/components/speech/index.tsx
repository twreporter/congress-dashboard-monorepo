'use client'
import React, { useState, useRef, useEffect } from 'react'
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
// context
import { useScrollContext } from '@/contexts/scroll-context'
// fetcher
import { type SpeechFromRes } from '@/fetchers/server/speech'
// hooks
import { useSpeechData } from '@/components/speech/hooks/use-speech-data'
// constants
import { InternalRoutes } from '@/constants/navigation-link'
// lodash
import throttle from 'lodash/throttle'
const _ = {
  throttle,
}

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

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

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
  const [scrollStage, setScrollStage] = useState(1)
  const lastY = useRef(0)
  const currentY = useRef(0)

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
        threshold: 0.5,
      }
    )
    observer.observe(leadingRef.current)
    return () => {
      observer.disconnect()
    }
  }, [leadingRef])

  useEffect(() => {
    const handleScroll = _.throttle(() => {
      const scrollThreshold = 16
      lastY.current = window.pageYOffset
      const scrollDistance = Math.abs(currentY.current - lastY.current)

      if (scrollDistance < scrollThreshold) {
        return
      }

      const scrollDirection = lastY.current > currentY.current ? 'down' : 'up'
      currentY.current = lastY.current

      if (scrollDirection === 'up') {
        setScrollStage((prevStage) => (prevStage - 1 < 1 ? 1 : prevStage - 1))
      } else {
        setScrollStage((prevStage) => (prevStage + 1 > 3 ? 3 : prevStage + 1))
      }
    }, 500)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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

  const cycleFontSize = () => {
    setFontSize((currentSize) => {
      switch (currentSize) {
        case FontSize.SMALL:
          return FontSize.MEDIUM
        case FontSize.MEDIUM:
          return FontSize.LARGE
        case FontSize.LARGE:
        default:
          return FontSize.SMALL
      }
    })
  }

  const handleSwitchSpeech = (direction: Direction) => {
    const currentIndex = speechGroup.indexOf(slug)
    if (direction === Direction.PREV && currentIndex > 0) {
      router.push(`${InternalRoutes.Speech}/${speechGroup[currentIndex - 1]}`)
    } else if (
      direction === Direction.NEXT &&
      currentIndex < speechGroup.length - 1
    ) {
      router.push(`${InternalRoutes.Speech}/${speechGroup[currentIndex + 1]}`)
    }
  }

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
          <DesktopAndAbove>
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
          </DesktopAndAbove>
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
            <SpeechAsideInfo
              legislator={legislator}
              attendee={attendee}
              relatedTopics={relatedTopics}
            />
            <SpeechAsideToolBar
              onFontSizeChange={cycleFontSize}
              currentFontSize={fontSize}
            />
            <SpeechAsideInfo
              legislator={legislator}
              attendee={attendee}
              relatedTopics={relatedTopics}
            />
          </AsideBlock>
        </DesktopAndAboveWithFlex>
        <TabletAndBelowWithFlex>
          <SpeechAsideInfo
            legislator={legislator}
            attendee={attendee}
            relatedTopics={relatedTopics}
          />
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
          <SpeechAsideInfo
            legislator={legislator}
            attendee={attendee}
            relatedTopics={relatedTopics}
          />
        </TabletAndBelowWithFlex>
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

export default SpeechPage
