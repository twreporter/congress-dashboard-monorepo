/* eslint-disable react/display-name */
'use client'

import React, { useState, useEffect, useMemo, useRef, forwardRef } from 'react'
import styled, { css } from 'styled-components'
// type
import type { TopNCouncilTopicData } from '@/types/council-topic'
import type { PartyData } from '@/types/party'
import type { CouncilMeeting } from '@/types/council-meeting'
import type {
  SidebarIssueProps,
  SidebarCouncilorProps,
} from '@/components/council-dashboard/sidebar'
import type {
  CouncilorForDashboard,
  CouncilFilterModalValueType,
} from '@/components/council-dashboard/type'
// utils
import toastr from '@/utils/toastr'
import { isMobile } from '@/utils/rwd'
// enum
import { Option } from '@/components/dashboard/enum'
// context
import { CouncilDashboardContext } from '@/components/council-dashboard/context'
// hook
import useCouncilFilter from '@/components/council-dashboard/hook/use-council-filter'
import useCouncilTopic from '@/components/council-dashboard/hook/use-council-topic'
import useCouncilor from '@/components/council-dashboard/hook/use-councilor'
import useOutsideClick from '@/hooks/use-outside-click'
import useWindowWidth from '@/hooks/use-window-width'
// components
import FunctionBar from '@/components/council-dashboard/function-bar'
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
  SidebarCouncilor,
} from '@/components/council-dashboard/sidebar'
import { GapHorizontal, Gap } from '@/components/skeleton'
import EmptyState from '@/components/dashboard/empty-state'
import ErrorState from '@/components/dashboard/error-state'
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
  ${mq.tabletOnly`
    padding: 0 32px;
  `}
  ${mq.mobileOnly`
    padding: 0 24px;
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
    width: 100% !important;
  `}

  ${(props) => (props.$hidden ? 'display: none !important;' : '')}
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
const StyledSidebarCouncilor = styled(
  forwardRef<HTMLDivElement, SidebarCouncilorProps>((props, ref) => (
    <SidebarCouncilor {...props} ref={ref} />
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
  initialTopics?: TopNCouncilTopicData[]
  parties?: PartyData[]
  meetings?: CouncilMeeting[]
  districtSlug: string
}
const Dashboard: React.FC<DashboardProps> = ({
  initialTopics = [],
  parties = [],
  meetings = [],
  districtSlug,
}) => {
  const windowWidth = useWindowWidth()
  const latestMeetingId = useMemo(() => meetings[0]?.id, [meetings])
  const [selectedType, setSelectedType] = useState(Option.Human)
  const [activeCardIndex, setActiveCardIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [topics, setTopics] = useState(initialTopics)
  const [councilors, setCouncilors] = useState<CouncilorForDashboard[]>([])
  const [shouldToastrOnHuman, setShouldToastrOnHuman] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [sidebarTopic, setSidebarTopic] = useState<SidebarIssueProps>({
    title: '',
    count: 0,
    slug: '',
    legislatorList: [],
    districtSlug,
  })
  const [sidebarHuman, setSidebarHuman] = useState<SidebarCouncilorProps>({
    title: '',
    slug: '',
    issueList: [],
    districtSlug,
  })
  const [sidebarGap, setSidebarGap] = useState(0)
  const sidebarRefs = useRef<Map<number, HTMLDivElement>>(new Map(null))
  const cardRef = useRef<HTMLDivElement>(null)
  const [hasMoreCouncilor, setHasMoreCouncilor] = useState(false)
  const isShowLoadMore = useMemo(() => {
    if (isLoading) {
      return false
    }

    if (selectedType === Option.Human) {
      return hasMoreCouncilor
    }

    // detemine has more topics
    return topics.length >= 10 ? topics.length % 10 === 0 : false
  }, [selectedType, topics, hasMoreCouncilor, isLoading])
  const isShowEmpty = useMemo(() => {
    const currentListLength =
      selectedType === Option.Issue ? topics.length : councilors.length
    return !isLoading && currentListLength === 0
  }, [selectedType, topics, councilors, isLoading])
  const [isShowError, setIsShowError] = useState(false)

  const { filterValues, setFilterValues, formatter, formattedFilterValues } =
    useCouncilFilter(meetings)
  const fetchTopics = useCouncilTopic(parties)
  const { fetchCouncilorAndTopTopics, loadMoreCouncilorAndTopTopics } =
    useCouncilor()

  useEffect(() => {
    const initializeCouncilor = async () => {
      const { data, hasMore } = await fetchCouncilorAndTopTopics({
        councilMeetingId: Number(latestMeetingId),
      })
      setCouncilors(data)
      setHasMoreCouncilor(hasMore)
    }
    try {
      initializeCouncilor()
    } catch (err) {
      console.error(`initialize councilor failed. err: ${err}`)
      setIsShowError(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (shouldToastrOnHuman && selectedType === Option.Human) {
      toastr({ text: '議員為隨機排列' })
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
    try {
      const loadMoreFunc =
        selectedType === Option.Issue ? loadMoreTopics : loadMoreHuman
      await loadMoreFunc()
    } catch (err) {
      console.error(`load more failed. err: ${err}`)
      setIsShowError(true)
    }
    setIsLoading(false)
  }
  const loadMoreTopics = async () => {
    const skip = topics.length
    const { meetingId } = formatter(filterValues)
    const moreTopics = await fetchTopics({
      skip,
      take: 10,
      councilMeetingId: meetingId,
    })
    setTopics((topics) => topics.concat(moreTopics))
  }
  const loadMoreHuman = async () => {
    const skip = councilors.length
    const { meetingId } = formatter(filterValues)
    const { data, hasMore } = await loadMoreCouncilorAndTopTopics({
      skip,
      take: 10,
      councilMeetingId: meetingId,
    })
    setCouncilors((councilors) => councilors.concat(data))
    setHasMoreCouncilor(hasMore)
  }

  const updateSidebarTopic = (index: number) => {
    const activeTopic = topics[index]
    setSidebarTopic({
      slug: activeTopic.slug,
      title: activeTopic.title,
      legislatorList: activeTopic.councilors,
      count: activeTopic.billCount,
      districtSlug,
    })
  }
  const updateSidebarHuman = (index: number) => {
    const activeCouncilor = councilors[index]
    setSidebarHuman({
      slug: activeCouncilor.slug,
      title: `${activeCouncilor.name}`,
      note: activeCouncilor.note,
      issueList: activeCouncilor.tags,
      districtSlug,
    })
  }

  const gotoTopic = (index: number) => {
    const activeTopic = topics[index]
    const url = `${InternalRoutes.CouncilTopic(districtSlug)}/${
      activeTopic.slug
    }`
    window.open(url, '_self')
  }
  const gotoHuman = (index: number) => {
    const activeCouncilor = councilors[index]
    const url = `${InternalRoutes.Councilor(districtSlug)}/${
      activeCouncilor.slug
    }`
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const onChangeFilter = async (
    filterModalValue: CouncilFilterModalValueType
  ) => {
    setIsLoading(true)
    await Promise.all([
      onChangeTopicFilter(filterModalValue),
      onChangeHumanFilter(filterModalValue),
    ])
    setIsLoading(false)
  }
  const onChangeTopicFilter = async (
    filterModalValue: CouncilFilterModalValueType
  ) => {
    setTopics([])
    const { meetingId, partyIds } = formatter(filterModalValue)
    const topics = await fetchTopics({
      take: 10,
      skip: 0,
      councilMeetingId: meetingId,
      partyIds,
    })
    setTopics(topics)
  }
  const onChangeHumanFilter = async (
    filterModalValue: CouncilFilterModalValueType
  ) => {
    setCouncilors([])
    const { meetingId, partyIds, constituency } = formatter(filterModalValue)
    const { data, hasMore } = await fetchCouncilorAndTopTopics({
      councilMeetingId: meetingId,
      partyIds,
      constituencies: constituency,
    })
    setCouncilors(data)
    setHasMoreCouncilor(hasMore)
    if (data.length > 0) {
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
    <CouncilDashboardContext.Provider value={contextValue}>
      <Box id={anchorId} ref={ref}>
        <StyledFunctionBar
          setTab={setTab}
          parties={parties}
          meetings={meetings}
          onChangeFilter={onChangeFilter}
          districtSlug={districtSlug}
        />
        {isShowError ? <ErrorState /> : null}
        {isShowEmpty ? <EmptyState /> : null}
        {!isShowEmpty && !isShowError ? (
          <CardSection
            $isScroll={showSidebar}
            $isSidebarOpened={showSidebar}
            $windowWidth={windowWidth}
          >
            <CardBox ref={cardRef}>
              <CardIssueBox $active={selectedType === Option.Issue}>
                {topics.map(
                  ({ title, billCount, councilorCount, councilors }, index) => (
                    <CardIssueRWD
                      key={`issue-card-${index}`}
                      title={title}
                      subTitle={`共 ${billCount} 筆相關質詢（${councilorCount}人）`}
                      legislators={councilors}
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
                    districtSlug={districtSlug}
                  />
                </TabletAndAbove>
              </CardIssueBox>
              <CardHumanBox
                $active={selectedType === Option.Human}
                $showBottomPadding={councilors.length === 1}
              >
                {councilors.map(
                  (props: CouncilorForDashboard, index: number) => (
                    <CardHumanRWD
                      key={`human-card-${index}`}
                      {...props}
                      selected={activeCardIndex === index}
                      onClick={(e: React.MouseEvent<HTMLElement>) =>
                        onClickCard(e, index)
                      }
                    />
                  )
                )}
                {isLoading ? (
                  <>
                    <CardHumanSkeletonRWD />
                    <CardHumanSkeletonRWD />
                    <CardHumanSkeletonRWD />
                    <CardHumanSkeletonRWD />
                  </>
                ) : null}
                <TabletAndAbove>
                  <StyledSidebarCouncilor
                    $show={showSidebar && selectedType === Option.Human}
                    {...sidebarHuman}
                    onClose={closeSidebar}
                    ref={(el: HTMLDivElement) => {
                      sidebarRefs.current[Option.Human] = el
                    }}
                    districtSlug={districtSlug}
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
        ) : null}
      </Box>
    </CouncilDashboardContext.Provider>
  )
}
export default Dashboard
