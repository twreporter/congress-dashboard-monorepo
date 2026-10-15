'use client'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import IconButton from '@/components/button/icon-button'
import { InternalRoutes } from '@/constants/routes'
// @twreporter
import {
  DesktopAndAbove,
  TabletAndBelow,
} from '@twreporter/react-components/lib/rwd'
import { Report } from '@twreporter/react-components/lib/icon'
import mq from '@twreporter/core/lib/utils/media-query'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import { TEN_YEAR_ANNIVERSARY } from '@twreporter/core/lib/constants/feature-flag'
// styles
import {
  ArticleContainer,
  LeadingContainer,
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
  IvodBlock,
  IvodSwitchBlock,
  IvodSwitchButtonContainer,
  P1Gray600,
  Spacing,
  ControlTabBadge,
  LeadingBadge,
  LeadingSubtitle,
} from '@/components/general-article/styles'
// components
import AsideInfo from '@/components/council-speech/aside-info'
import { SourceMobileToolbar } from '@/components/general-article/mobile-toolbar'
import Content from '@/components/general-article/content'
import SpeechDate from '@/components/general-article/date'
import SpeechTitle from '@/components/general-article/title'
import AsideToolbar from '@/components/bill/aside-toolbar'
import SpeechSummary from '@/components/general-article/summary'
import SeparationCurve from '@/components/general-article/separation-curve'
import CustomPillButton from '@/components/button/pill-button'
import DonationBox from '@/components/about/donation-box'
import NewDonationBox from '@/components/about/new-donation-box'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// hooks
import { useScrollStage } from '@/components/general-article/hooks/use-scroll-stage'
import {
  Direction,
  FontSize,
  FontSizeOffset,
} from '@/components/general-article/constants'
import { useCouncilSpeechData } from './hook/use-council-speech-data'
// utils
import { openFeedback } from '@/utils/feedback'
import { getSpeechNeighbors } from '@/utils/council-speech-group'
// types
import type { CouncilSpeechFromRes } from '@/types/council-speech'
// @twreporter
import { Source } from '@twreporter/react-components/lib/icon'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

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

// constants
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const intersectionThreshold = 0.5
const Donation = TEN_YEAR_ANNIVERSARY ? NewDonationBox : DonationBox

type CouncilSpeechPageProps = {
  speech: CouncilSpeechFromRes
  speechGroup: string[]
}
const CouncilSpeechPage: React.FC<CouncilSpeechPageProps> = ({
  speech,
  speechGroup,
}) => {
  const router = useRouter()
  const { previous, next } = getSpeechNeighbors(speechGroup, speech.slug)
  const isFirstSpeech = !previous
  const isLastSpeech = !next
  const handleSwitchSpeech = (direction: Direction) => {
    const target = direction === Direction.PREV ? previous : next
    if (target) router.push(`${InternalRoutes.CouncilSpeech}/${target}`)
  }
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
    date,
    title,
    attendee,
    summary,
    content,
    sourceLink,
    relatedTopics,
    councilors,
  } = useCouncilSpeechData(speech)

  const cycleFontSize = useCallback(() => {
    setFontSize((current) =>
      current === FontSize.SMALL
        ? FontSize.MEDIUM
        : current === FontSize.MEDIUM
        ? FontSize.LARGE
        : FontSize.SMALL
    )
  }, [])

  const openSourceLink = useCallback(() => {
    if (!sourceLink) {
      alert('此逐字稿沒有資料來源')
      return
    }
    window.open(sourceLink, '_blank', 'noopener,noreferrer')
  }, [sourceLink])

  // memoize props passed repeatedly
  const asideInfoProps = useMemo(
    () => ({ councilors, attendee, relatedTopics }),
    [councilors, attendee, relatedTopics]
  )

  return (
    <ArticleContainer>
      <ControlTabContainer
        className="hidden-print"
        $isHeaderHidden={isHeaderHidden}
        $isHidden={isControllBarHidden}
      >
        <ControlTab $isHeaderAbove={!isHeaderHidden && !isControllBarHidden}>
          <DateAndTitle>
            <ControlTabBadge $bgColor={colorGrayscale.gray900}>
              發言
            </ControlTabBadge>
            <ControlTabDate weight={P1.Weight.BOLD} text={date} />
            <ControlTabTitle weight={P1.Weight.BOLD} text={title} />
          </DateAndTitle>
          <ControlItems>
            <CustomPillButton
              onClick={openSourceLink}
              leftIconComponent={<Source releaseBranch={releaseBranch} />}
              text={'資料來源'}
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
        <LeadingSubtitle>
          <LeadingBadge $bgColor={colorGrayscale.gray900}>發言</LeadingBadge>
          <SpeechDate date={date} />
        </LeadingSubtitle>
        <SpeechTitle title={title} />
        <DesktopAndAboveWithFlex>
          <IvodBlock>
            <CustomPillButton
              onClick={openSourceLink}
              leftIconComponent={<Source releaseBranch={releaseBranch} />}
              text={'資料來源'}
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
            <AsideInfo {...asideInfoProps} />
            <AsideToolbar
              onFontSizeChange={cycleFontSize}
              currentFontSize={fontSize}
            />
          </AsideBlock>
        </DesktopAndAboveWithFlex>
        <TabletAndBelowWithFlex>
          <AsideInfo {...asideInfoProps} />
        </TabletAndBelowWithFlex>
        <ContentBlock>
          <SpeechSummary
            summary={summary}
            fontSizeOffset={FontSizeOffset[fontSize]}
          />
          {summary.length > 0 && <SeparationCurve />}
          <Content
            content={content}
            fontSizeOffset={FontSizeOffset[fontSize]}
          />
        </ContentBlock>
        <TabletAndBelowWithFlex>
          <AsideInfo {...asideInfoProps} />
        </TabletAndBelowWithFlex>
        <DesktopAndAboveWithFlex>
          <Feedback onClick={() => openFeedback('council-speech')}>
            <CustomPillButton
              leftIconComponent={<Report releaseBranch={releaseBranch} />}
              text={'問題回報'}
            />
          </Feedback>
        </DesktopAndAboveWithFlex>
      </BodyContainer>
      <Donation />
      <TabletAndBelow className="hidden-print">
        <SourceMobileToolbar
          onFontSizeChange={cycleFontSize}
          scrollStage={scrollStage}
          sourceLink={sourceLink}
          speechSwitch={{
            onSwitchClick: handleSwitchSpeech,
            isFirstSpeech,
            isLastSpeech,
          }}
          feedbackEventName="council speech mobile toolbar"
          emptySourceMessage="此逐字稿沒有資料來源"
        />
      </TabletAndBelow>
    </ArticleContainer>
  )
}

export default React.memo(CouncilSpeechPage)
