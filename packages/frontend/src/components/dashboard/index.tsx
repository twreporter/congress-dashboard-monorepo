/* eslint-disable react/display-name */
'use client'

import React, { useState, useEffect, useMemo, useRef, forwardRef } from 'react'
import styled, { css } from 'styled-components'
// type
import type { TopNTopicData } from '@/fetchers/server/topic'
import type { partyData } from '@/fetchers/party'
import type { LegislativeMeeting } from '@/fetchers/server/legislative-meeting'
import type { SidebarIssueProps } from '@/components/sidebar'
import type { Legislator } from '@/components/dashboard/type'
import type { FilterModalValueType } from '@/components/dashboard/type'
// utils
import toastr from '@/utils/toastr'
import { isMobile } from '@/utils/rwd'
// enum
import { Option } from '@/components/dashboard/enum'
// context
import { DashboardContext } from '@/components/dashboard/context'
// hook
import useFilter from '@/components/dashboard/hook/use-filter'
import useTopic from '@/components/dashboard/hook/use-topic'
import useLegislator from '@/components/dashboard/hook/use-legislator'
import useOutsideClick from '@/hooks/use-outside-click'
import useWindowWidth from '@/hooks/use-window-width'
// components
import FunctionBar from '@/components/dashboard/function-bar'
import {
  CardIssueRWD,
  CardIssueSkeletonRWD,
} from '@/components/dashboard/card/issue'
import {
  CardHumanRWD,
  CardHumanSkeletonRWD,
} from '@/components/dashboard/card/human'
import {
  SidebarIssue,
  SidebarLegislator,
  type SidebarLegislatorProps,
} from '@/components/sidebar'
import { GapHorizontal, Gap } from '@/components/skeleton'
import EmptyContent from '@/components/dashboard/empty-state'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { PillButton } from '@twreporter/react-components/lib/button'
import {
  TabletAndAbove,
  MobileOnly,
} from '@twreporter/react-components/lib/rwd'
// z-index
import { ZIndex } from '@/styles/z-index'
// lodash
import { find } from 'lodash'
import { InternalRoutes } from '@/constants/routes'
const _ = {
  find,
}

const Box = styled.div`
  background: ${colorGrayscale.gray100};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 0 0;
  gap: 32px;

  ${mq.desktopOnly`
    padding: 40px 0 0 0 ;
  `}
  ${mq.tabletOnly`
    padding: 32px 0 0 0;
    gap: 24px;
  `}
  ${mq.mobileOnly`
    padding: 20px 0 0 0;
    gap: 20px;  
  `}
`
const StyledFunctionBar = styled(FunctionBar)`
  padding: 0 256px 0px 256px;

  ${mq.tabletOnly`
    padding: 0 32px 0px 32px;
  `}
  ${mq.mobileOnly`
    padding: 0 24px 0px 24px;
  `}
`
const cardCss = css`
  width: 928px;

  ${mq.tabletOnly`
    width: calc( 100vw - 64px );
  `}
  ${mq.mobileOnly`
    width: calc( 100vw - 48px);
  `}
`
const CardBox = styled.div`
  ${cardCss}
  display: flex;
  flex-direction: column;
  align-items: center;
`
const CardIssueBox = styled.div<{ $active: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  ${(props) => (props.$active ? '' : 'display: none !important;')}
`
const CardHumanBox = styled.div<{
  $active: boolean
  $showBottomPadding: boolean
}>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: 24px;
  ${(props) => (props.$active ? '' : 'display: none !important;')}
  ${(props) => (props.$showBottomPadding ? 'padding-bottom: 24px;' : '')}

  ${mq.mobileOnly`
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-gap: 20px;
    ${(props) => (props.$showBottomPadding ? 'padding-bottom: 20px;' : '')}

    & > * {
      width: calc(100vw - 48px);
    }
  `}
`
/*
 * grid card would have redundant column gap when number of cards is even
 * thus load more margin top would be 64px (the expected gap) - 24px (redundant column gap)
 */
const LoadMore = styled(PillButton)<{ $hidden: boolean }>`
  margin-top: 40px;
  justify-content: center;
  width: 300px !important;

  ${mq.mobileOnly`
    margin-top: 32px;
    width: calc(100% - 32px) !important;
  `}

  ${(props) => (props.$hidden ? 'display: none;' : '')}
`
const sidebarCss = css<{ $show: boolean }>`
  transform: translateX(${(props) => (props.$show ? 0 : 520)}px);
  transition: transform 0.3s ease-in-out;

  position: fixed;
  right: 0;
  top: 0;
  z-index: ${ZIndex.SideBar};
  overflow-y: scroll;
`
const StyledSidebarIssue = styled(
  forwardRef<HTMLDivElement, SidebarIssueProps>((props, ref) => (
    <SidebarIssue {...props} ref={ref} />
  ))
)<{ $show: boolean }>`
  ${sidebarCss}
`
const StyledSidebarLegislator = styled(
  forwardRef<HTMLDivElement, SidebarLegislatorProps>((props, ref) => (
    <SidebarLegislator {...props} ref={ref} />
  ))
)<{ $show: boolean }>`
  ${sidebarCss}
`
const GapHorizontalWithStyle = styled(GapHorizontal)`
  transition: width 0.3s ease-in-out;
`
const CardSection = styled.div<{
  $isScroll: boolean
  $isSidebarOpened: boolean
  $windowWidth: number
}>`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  ${(props) =>
    props.$isScroll
      ? `
    overflow-x: scroll;
    scrollbar-width: none;
  `
      : ''}

  ${mq.desktopAndAbove`
    ${(props) =>
      props.$windowWidth
        ? `
        max-width: 100%;
        padding: 0 ${
          props.$isSidebarOpened ? 0 : (props.$windowWidth - 928) / 2
        }px 0 ${(props.$windowWidth - 928) / 2}px;
      `
        : `
        max-width: 928px;
      `}
  `}

  ${(props) =>
    props.$isSidebarOpened
      ? `
      width: 100vw;
    `
      : ''}

  ${mq.tabletAndBelow`
    max-width: 100%;
    padding: 0 32px;
  `}

  ${mq.mobileOnly`
    padding: 0 24px;
  `}

  ${CardBox}, ${GapHorizontalWithStyle} {
    flex: none;
  }
`

const anchorId = 'anchor-id'
type DashboardProps = {
  initialTopics?: TopNTopicData & {
    legislators?: Legislator[]
  }
  parties?: partyData[]
  meetings?: LegislativeMeeting[]
}
const Dashboard: React.FC<DashboardProps> = ({
  initialTopics = [],
  parties = [],
  meetings = [],
}) => {
  const windowWidth = useWindowWidth()
  const latestMeetingId = useMemo(() => meetings[0]?.id, [meetings])
  const [selectedType, setSelectedType] = useState(Option.Issue)
  const [activeCardIndex, setActiveCardIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [topics, setTopics] = useState(initialTopics)
  const [legislators, setLegislators] = useState<Legislator[]>([])
  const [shouldToastrOnHuman, setShouldToastrOnHuman] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [sidebarTopic, setSidebarTopic] = useState<SidebarIssueProps>({
    title: '',
    count: 0,
    slug: '',
    legislatorList: [],
  })
  const [sidebarHuman, setSidebarHuman] = useState<SidebarLegislatorProps>({
    title: '',
    slug: '',
    issueList: [],
  })
  const [sidebarGap, setSidebarGap] = useState(0)
  const sidebarRefs = useRef<Map<number, HTMLDivElement>>(new Map(null))
  const cardRef = useRef<HTMLDivElement>(null)
  const isShowLoadMore = useMemo(() => {
    const currentListLength =
      selectedType === Option.Issue ? topics.length : legislators.length
    return (
      !isLoading &&
      (currentListLength >= 10 ? currentListLength % 10 === 0 : false)
    )
  }, [selectedType, topics, legislators, isLoading])
  const isShowEmpty = useMemo(() => {
    const currentListLength =
      selectedType === Option.Issue ? topics.length : legislators.length
    return !isLoading && currentListLength === 0
  }, [selectedType, topics, legislators, isLoading])

  const { filterValues, setFilterValues, formatter, formattedFilterValues } =
    useFilter(meetings)
  const fetchTopics = useTopic(parties)
  const { fetchLegislatorAndTopTopics, loadMoreLegislatorAndTopTopics } =
    useLegislator()

  useEffect(() => {
    const initializeLegislator = async () => {
      const legislators = await fetchLegislatorAndTopTopics({
        legislativeMeetingId: Number(latestMeetingId),
      })
      setLegislators(legislators)
    }
    initializeLegislator()
  }, [])

  useEffect(() => {
    if (shouldToastrOnHuman && selectedType === Option.Human) {
      toastr({ text: '立委為隨機排列' })
      setShouldToastrOnHuman(false)
    }
  }, [selectedType, shouldToastrOnHuman])

  useEffect(() => {
    setShowSidebar(false)
  }, [selectedType])

  const setTab = (value: Option) => {
    setActiveCardIndex(-1)
    setSelectedType(value)
  }
  const closeSidebar = () => {
    setShowSidebar(false)
    setSidebarGap(0)
    setActiveCardIndex(-1)
  }

  const loadMore = async () => {
    setIsLoading(true)
    const loadMoreFunc =
      selectedType === Option.Issue ? loadMoreTopics : loadMoreHuman
    await loadMoreFunc()
    setIsLoading(false)
  }
  const loadMoreTopics = async () => {
    const skip = topics.length
    const { meetingId, sessionIds } = formatter(filterValues)
    const moreTopics = await fetchTopics({
      skip,
      take: 10,
      legislativeMeetingId: meetingId,
      legislativeMeetingSessionIds: sessionIds,
    })
    setTopics((topics) => topics.concat(moreTopics))
  }
  const loadMoreHuman = async () => {
    const skip = legislators.length
    const { meetingId, sessionIds } = formatter(filterValues)
    const moreLegislators = await loadMoreLegislatorAndTopTopics({
      skip,
      take: 10,
      legislativeMeetingId: meetingId,
      legislativeMeetingSessionIds: sessionIds,
    })
    setLegislators((legislators) => legislators.concat(moreLegislators))
  }

  const updateSidebarTopic = (index: number) => {
    const activeTopic = topics[index]
    setSidebarTopic({
      slug: activeTopic.slug,
      title: activeTopic.title,
      legislatorList: activeTopic.legislators,
      count: activeTopic.speechCount,
    })
  }
  const updateSidebarHuman = (index: number) => {
    const activeLegislator = legislators[index]
    setSidebarHuman({
      slug: activeLegislator.slug,
      title: `${activeLegislator.name}`,
      note: activeLegislator.note,
      issueList: activeLegislator.tags,
    })
  }

  const gotoTopic = (index: number) => {
    const activeTopic = topics[index]
    const url = `${InternalRoutes.Topic}/${activeTopic.slug}`
    window.open(url, '_self')
  }
  const gotoHuman = (index: number) => {
    const activeLegislator = legislators[index]
    const url = `${InternalRoutes.Legislator}/${activeLegislator.slug}`
    window.open(url, '_self')
  }

  const calculateSidebarGap = () => {
    // set animations for sidebar
    let newSidebarGap = 520 + 24
    const sidebarComponent = sidebarRefs.current[selectedType]
    const cardComponent = cardRef.current
    if (sidebarComponent && cardComponent) {
      let needGap = sidebarComponent.offsetWidth
      const hasGap = cardComponent.offsetLeft
      if (cardComponent.offsetWidth === 928) {
        // desktop and above
        needGap += 32
        newSidebarGap = hasGap > needGap ? 0 : needGap
      } else {
        needGap += 24
        newSidebarGap = needGap - hasGap
      }
    }
    setSidebarGap(newSidebarGap > 0 ? newSidebarGap : 0)
  }
  useEffect(() => {
    if (showSidebar) {
      calculateSidebarGap()
    }
  }, [windowWidth, showSidebar])
  useEffect(() => {
    if (activeCardIndex > -1) {
      setShowSidebar(true)
    }
  }, [activeCardIndex])

  const onClickCard = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (isMobile()) {
      const opener = selectedType === Option.Issue ? gotoTopic : gotoHuman
      opener(index)
      return
    }

    // toggle sidebar
    if (index === activeCardIndex) {
      closeSidebar()
      return
    }

    setActiveCardIndex(index)

    // set sidebar data
    const updater =
      selectedType === Option.Issue ? updateSidebarTopic : updateSidebarHuman
    updater(index)

    const cardElement = e.currentTarget as HTMLElement
    if (cardElement) {
      cardElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      const isRightItem = cardElement.offsetLeft > windowWidth / 2
      if (selectedType === Option.Human && isRightItem) {
        window.setTimeout(() => {
          cardElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
          })
        }, 300)
      }
    }
  }

  const onChangeFilter = async (filterModalValue: FilterModalValueType) => {
    setIsLoading(true)
    await Promise.all([
      onChangeTopicFilter(filterModalValue),
      onChangeHumanFilter(filterModalValue),
    ])
    setIsLoading(false)
  }
  const onChangeTopicFilter = async (
    filterModalValue: FilterModalValueType
  ) => {
    setTopics([])
    const { meetingId, sessionIds } = formatter(filterModalValue)
    const topics = await fetchTopics({
      take: 10,
      skip: 0,
      legislativeMeetingId: meetingId,
      legislativeMeetingSessionIds: sessionIds,
    })
    setTopics(topics)
  }
  const onChangeHumanFilter = async (
    filterModalValue: FilterModalValueType
  ) => {
    setLegislators([])
    const { meetingId, sessionIds, partyIds, constituency, committeeSlugs } =
      formatter(filterModalValue)
    const legislators = await fetchLegislatorAndTopTopics({
      legislativeMeetingId: meetingId,
      legislativeMeetingSessionIds: sessionIds,
      partyIds,
      constituencies: constituency,
      committeeSlugs,
    })
    setLegislators(legislators)
    if (legislators.length > 0) {
      setShouldToastrOnHuman(true)
    }
  }

  const contextValue = {
    tabType: selectedType,
    filterValues,
    setFilterValues,
    formattedFilterValues,
  }

  const ref = useOutsideClick(closeSidebar)

  return (
    <DashboardContext.Provider value={contextValue}>
      <Box id={anchorId} ref={ref}>
        <StyledFunctionBar
          setTab={setTab}
          parties={parties}
          meetings={meetings}
          onChangeFilter={onChangeFilter}
        />
        {isShowEmpty ? (
          <EmptyContent />
        ) : (
          <CardSection
            $isScroll={showSidebar}
            $isSidebarOpened={showSidebar}
            $windowWidth={windowWidth}
          >
            <CardBox ref={cardRef}>
              <CardIssueBox $active={selectedType === Option.Issue}>
                {topics.map(
                  (
                    { title, speechCount, legislatorCount, legislators },
                    index
                  ) => (
                    <CardIssueRWD
                      key={`issue-card-${index}`}
                      title={title}
                      subTitle={`共 ${speechCount} 筆相關發言（${legislatorCount}人）`}
                      legislators={legislators}
                      selected={activeCardIndex === index}
                      onClick={(e: React.MouseEvent<HTMLElement>) =>
                        onClickCard(e, index)
                      }
                    />
                  )
                )}
                {isLoading ? (
                  <>
                    <CardIssueSkeletonRWD />
                    <CardIssueSkeletonRWD />
                    <CardIssueSkeletonRWD />
                    <CardIssueSkeletonRWD />
                  </>
                ) : null}
                <TabletAndAbove>
                  <StyledSidebarIssue
                    $show={showSidebar && selectedType === Option.Issue}
                    {...sidebarTopic}
                    onClose={closeSidebar}
                    ref={(el: HTMLDivElement) => {
                      sidebarRefs.current[Option.Issue] = el
                    }}
                  />
                </TabletAndAbove>
              </CardIssueBox>
              <CardHumanBox
                $active={selectedType === Option.Human}
                $showBottomPadding={legislators.length === 1}
              >
                {legislators.map((props: Legislator, index: number) => (
                  <CardHumanRWD
                    key={`human-card-${index}`}
                    {...props}
                    selected={activeCardIndex === index}
                    onClick={(e: React.MouseEvent<HTMLElement>) =>
                      onClickCard(e, index)
                    }
                  />
                ))}
                {isLoading ? (
                  <>
                    <CardHumanSkeletonRWD />
                    <CardHumanSkeletonRWD />
                    <CardHumanSkeletonRWD />
                    <CardHumanSkeletonRWD />
                  </>
                ) : null}
                <TabletAndAbove>
                  <StyledSidebarLegislator
                    $show={showSidebar && selectedType === Option.Human}
                    {...sidebarHuman}
                    onClose={closeSidebar}
                    ref={(el: HTMLDivElement) => {
                      sidebarRefs.current[Option.Human] = el
                    }}
                  />
                </TabletAndAbove>
              </CardHumanBox>
              <LoadMore
                $hidden={!isShowLoadMore}
                text={'載入更多'}
                theme={PillButton.THEME.normal}
                style={PillButton.Style.DARK}
                type={PillButton.Type.PRIMARY}
                size={PillButton.Size.L}
                onClick={loadMore}
              />
              <TabletAndAbove>
                <Gap $gap={120} />
              </TabletAndAbove>
              <MobileOnly>
                <Gap $gap={64} />
              </MobileOnly>
            </CardBox>
            <GapHorizontalWithStyle $gap={sidebarGap} />
          </CardSection>
        )}
      </Box>
    </DashboardContext.Provider>
  )
}
export default Dashboard
