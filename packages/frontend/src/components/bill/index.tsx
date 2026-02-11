'use client'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
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
  SpeechContainer,
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
} from '@/components/speech/styles'
// components
import AsideInfo from '@/components/bill/aside-info'
import MobileToolbar from '@/components/bill/mobile-toolbar'
import Content from '@/components/bill/content'
import SpeechDate from '@/components/speech/speech-date'
import SpeechTitle from '@/components/speech/speech-title'
import AsideToolbar from '@/components/bill/aside-toolbar'
import SpeechSummary from '@/components/speech/speech-summary'
import SeparationCurve from '@/components/speech/separation-curve'
import CustomPillButton from '@/components/button/pill-button'
import DonationBox from '@/components/about/donation-box'
import NewDonationBox from '@/components/about/new-donation-box'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// hooks
import { useScrollStage } from '@/components/speech/hooks/use-scroll-stage'
import { useBillData } from './hook/use-bill-data'
// utils
import { openFeedback } from '@/utils/feedback'
// types
import type { BillFromRes } from '@/types/council-bill'
// @twreporter
import { Source } from '@twreporter/react-components/lib/icon'

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

// constants
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const intersectionThreshold = 0.5
const Donation = TEN_YEAR_ANNIVERSARY ? NewDonationBox : DonationBox

type BillPageProps = {
  bill: BillFromRes
}
const BillPage: React.FC<BillPageProps> = ({ bill }) => {
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
  } = useBillData(bill)

  const cycleFontSize = useCallback(() => {
    setFontSize((current) =>
      current === FontSize.SMALL
        ? FontSize.MEDIUM
        : current === FontSize.MEDIUM
        ? FontSize.LARGE
        : FontSize.SMALL
    )
  }, [])

  // memoize props passed repeatedly
  const asideInfoProps = useMemo(
    () => ({ councilors, attendee, relatedTopics }),
    [councilors, attendee, relatedTopics]
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
              onClick={() => window.open(sourceLink, '_blank')}
              leftIconComponent={<Source releaseBranch={releaseBranch} />}
              text={'資料來源'}
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
              onClick={() => window.open(sourceLink, '_blank')}
              leftIconComponent={<Source releaseBranch={releaseBranch} />}
              text={'資料來源'}
            />
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
          <Feedback onClick={() => openFeedback('council-bill')}>
            <CustomPillButton
              leftIconComponent={<Report releaseBranch={releaseBranch} />}
              text={'問題回報'}
            />
          </Feedback>
        </DesktopAndAboveWithFlex>
      </BodyContainer>
      <Donation />
      <TabletAndBelow className="hidden-print">
        <MobileToolbar
          onFontSizeChange={cycleFontSize}
          scrollStage={scrollStage}
          sourceLink={sourceLink}
        />
      </TabletAndBelow>
    </SpeechContainer>
  )
}

export default React.memo(BillPage)
