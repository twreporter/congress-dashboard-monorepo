'use client'
import React, { useRef, useState, useEffect, ReactNode } from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { H1, H5 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import { TabletAndAbove } from '@twreporter/react-components/lib/rwd'
// components
import { Gap } from '@/components/skeleton'
// utils
import { notoSerif } from '@/utils/font'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// constants
import { HEADER_HEIGHT } from '@/constants/header'
// z-index
import { ZIndex } from '@/styles/z-index'
// cheetsheet
import { textOverflowEllipsisCss } from '@/styles/cheetsheet'

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${colorGrayscale.gray100};
  padding-top: 48px;
  padding-bottom: 120px;
  align-items: center;
  ${mq.desktopOnly`
    padding-left: 48px;
    padding-right: 48px;
  `}
  ${mq.tabletOnly`
    padding: 32px 32px 80px;
  `}
  ${mq.mobileOnly`
    padding: 32px 24px 80px;
  `}
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${mq.hdOnly`
    width: 1120px;
  `}
  ${mq.desktopOnly`
    max-width: 1016px;
    margin: auto;
  `}
`

const LeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 64px;
  ${mq.tabletOnly`
    gap: 32px;
  `}
  ${mq.mobileOnly`
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  `}
`

const PageTitle = styled(H1)`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`

const FunctionBarWrapper = styled.div<{
  $isHeaderHidden?: boolean
  $isHidden?: boolean
}>`
  z-index: ${ZIndex.ControlBar};
  position: fixed;
  top: ${(props) =>
    props.$isHidden
      ? '-64px'
      : props.$isHeaderHidden
      ? '0'
      : `${HEADER_HEIGHT}px`};
  transform: ${(props) =>
    props.$isHidden ? 'translateY(-100%)' : 'translateY(0)'};
  transition: all 300ms ease-in-out;
  width: 100%;
  display: flex;
  background-color: ${colorGrayscale.gray100};
  border-top: 1px solid ${colorGrayscale.gray300};
  border-bottom: 1px solid ${colorGrayscale.gray300};
  ${mq.hdOnly`
    width: 1280px;
    margin: auto;
  `}
  ${mq.desktopOnly`
    padding: 0 48px;
  `}
  ${mq.tabletOnly`
    padding: 0 32px;
  `}
  ${mq.mobileOnly`
    padding: 0 24px;
  `}
`

const FunctionBar = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  gap: 80px;
  ${mq.tabletOnly`
    gap: 48px;
  `}
  ${mq.mobileOnly`
    gap: 20px;
    padding: 12px 0;
  `}
`

const FunctionBarTitle = styled(H5)`
  ${textOverflowEllipsisCss}
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`

const Subtitle = styled(P1)`
  color: ${colorGrayscale.gray700};
`

const ContentBlock = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  ${mq.tabletAndBelow`
    width: 100%;
    flex-direction: column;
  `}
`

type ContentPageLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

const ContentPageLayout: React.FC<ContentPageLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  const { setTabElement, isHeaderHidden } = useScrollContext()
  const leadingRef = useRef<HTMLDivElement>(null)
  const [isControllBarHidden, setIsControllBarHidden] = useState(true)

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

  return (
    <PageWrapper>
      <FunctionBarWrapper
        $isHeaderHidden={isHeaderHidden}
        $isHidden={isControllBarHidden}
      >
        <FunctionBar>
          <FunctionBarTitle text={title} />
          <TabletAndAbove>
            <Subtitle text={subtitle} />
          </TabletAndAbove>
        </FunctionBar>
      </FunctionBarWrapper>
      <Container>
        <LeadingContainer ref={leadingRef}>
          <PageTitle text={title} />
          <Subtitle text={subtitle} />
        </LeadingContainer>
        <Gap $gap={32} />
        <ContentBlock>{children}</ContentBlock>
      </Container>
    </PageWrapper>
  )
}

export default ContentPageLayout
