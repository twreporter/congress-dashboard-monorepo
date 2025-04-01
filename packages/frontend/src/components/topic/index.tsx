'use client'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// twreporter
import {
  TabletAndAbove,
  TabletAndBelow,
  DesktopAndAbove,
} from '@twreporter/react-components/lib/rwd'
// components
import FilterButton from '@/components/button/filter-button'
import TopicList from '@/components/topic/topic-list'
import { Issue } from '@/components/sidebar/followMore'
import FilterModal, {
  type FilterOption,
  type FilterModalValueType, // Add this import for the type
} from '@/components/filter-modal'
import { SelectorType } from '@/components/selector'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// styles
import {
  TopicWrapper,
  TopicContainer,
  LeadingContainer,
  TopicTitle,
  FilterBar,
  P1Gray700,
  Spacing,
  ContentBlock,
  DesktopAside,
  TopicListContainer,
  StatisticsBlock,
  StatisticsDiv,
  P1Gray800,
  StatisticsNumber,
  RelatedArticleBlock,
  H4Title,
  OthersWatchingBlock,
  OthersWatchingTags,
  Feedback,
  FunctionBarWrapper,
  FunctionBar,
  FunctionBarTitle,
} from '@/components/topic/styles'
//  fetcher
import { type TopicData } from '@/fetchers/topic'
import {
  useLegislativeMeeting,
  useLegislativeMeetingSession,
} from '@/fetchers/legislative-meeting'
// lodash
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
const _ = {
  groupBy,
  map,
}

const formatDateToYearMonth = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return `${year}/${month}`
}

const othersWatchingTags = [
  {
    title: '環境1',
    slug: 'slug-1',
  },
  {
    title: '環境2',
    slug: 'slug-2',
  },
  {
    title: '環境3',
    slug: 'slug-3',
  },
  {
    title: '環境4',
    slug: 'slug-4',
  },
]

type TopicPageProps = {
  topic: TopicData
  currentMeetingTerm: number
  currentMeetingSession: number[]
}

const Topic: React.FC<TopicPageProps> = ({
  topic,
  currentMeetingTerm,
  currentMeetingSession,
}) => {
  const router = useRouter()
  const { setTabElement, isHeaderHidden } = useScrollContext()
  const leadingRef = useRef<HTMLDivElement>(null)
  const [isControllBarHidden, setIsControllBarHidden] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterCount, setFilterCount] = useState(0)
  const [filterValues, setFilterValues] = useState({
    meeting: String(currentMeetingTerm),
    meetingSession: currentMeetingSession.map(String),
  })

  const legislativeMeetingState = useLegislativeMeeting()
  const legislativeMeetingSessionState = useLegislativeMeetingSession(
    filterValues.meeting
  )

  // Auto-select 'all' if all sessions are selected
  useEffect(() => {
    if (
      !legislativeMeetingSessionState.isLoading &&
      legislativeMeetingSessionState.legislativeMeetingSessions.length > 0
    ) {
      const allSessionValues =
        legislativeMeetingSessionState.legislativeMeetingSessions.map(
          ({ term }) => term.toString()
        )

      // Check if filterValues.meetingSession includes all available sessions
      const isAllSelected =
        allSessionValues.every((value) =>
          filterValues.meetingSession.includes(value)
        ) && filterValues.meetingSession.length >= allSessionValues.length

      if (isAllSelected && !filterValues.meetingSession.includes('all')) {
        setFilterValues((prev) => ({
          ...prev,
          meetingSession: ['all'],
        }))
      }
    }
  }, [
    filterValues.meetingSession,
    legislativeMeetingSessionState.isLoading,
    legislativeMeetingSessionState.legislativeMeetingSessions,
  ])

  // Handle selection changes - when a specific option is selected, remove 'all'
  const handleFilterValueChange = (newValues: FilterModalValueType) => {
    // When meeting term changes, reset session values
    if (newValues.meeting !== filterValues.meeting) {
      setFilterValues({
        meeting: newValues.meeting as string,
        meetingSession: ['all'],
      })
      return
    }

    // Handle meeting session changes
    if (newValues.meetingSession !== filterValues.meetingSession) {
      const newMeetingSession = [...(newValues.meetingSession as string[])]

      // If 'all' is newly selected, clear other selections
      if (
        newMeetingSession.includes('all') &&
        !filterValues.meetingSession.includes('all')
      ) {
        setFilterValues({
          ...(newValues as { meeting: string; meetingSession: string[] }),
          meetingSession: ['all'],
        })
        return
      }

      // If another option is selected while 'all' is already selected, remove 'all'
      if (newMeetingSession.includes('all') && newMeetingSession.length > 1) {
        const filteredSessions = newMeetingSession.filter(
          (val) => val !== 'all'
        )
        setFilterValues({
          ...(newValues as { meeting: string; meetingSession: string[] }),
          meetingSession: filteredSessions,
        })
        return
      }

      // Default case: just update the values
      setFilterValues(
        newValues as { meeting: string; meetingSession: string[] }
      )
    } else {
      setFilterValues(
        newValues as { meeting: string; meetingSession: string[] }
      )
    }
  }

  useEffect(() => {
    // If "all" is selected, don't count it as a filter
    if (filterValues.meetingSession.includes('all')) {
      setFilterCount(0)
    } else {
      setFilterCount(filterValues.meetingSession.length)
    }
  }, [filterValues.meetingSession])

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

  const { legislatorCount, legislatorsData, speechesByLegislator } =
    useMemo(() => {
      if (!topic?.speeches || !topic.speeches.length) {
        return {
          legislatorCount: 0,
          legislatorsData: [],
          speechesByLegislator: {},
        }
      }
      const speechesByLegislator = _.groupBy(
        topic.speeches,
        (speech) => speech.legislativeYuanMember.legislator.slug
      )
      const legislatorCount = Object.keys(speechesByLegislator).length
      const legislatorsData = Object.entries(speechesByLegislator).map(
        ([slug, speeches]) => ({
          name: speeches[0].legislativeYuanMember.legislator.name,
          slug,
          imageLink:
            speeches[0].legislativeYuanMember.legislator.image?.imageFile
              ?.url || speeches[0].legislativeYuanMember.legislator.imageLink,
          count: speeches.length,
        })
      )
      return { legislatorCount, legislatorsData, speechesByLegislator }
    }, [topic?.speeches])

  const filterOptions = useMemo((): FilterOption[] => {
    const options: FilterOption[] = [
      {
        type: SelectorType.Single,
        disabled: false,
        label: '屆期',
        value: 'meeting',
        isLoading: legislativeMeetingState.isLoading,
        options: _.map(
          legislativeMeetingState.legislativeMeeting,
          ({ term }: { term: number }) => ({
            label: `第 ${term} 屆`,
            value: term.toString(),
          })
        ),
      },
      {
        type: SelectorType.Multiple,
        disabled: false,
        defaultValue: ['all'],
        label: '會期',
        value: 'meetingSession',
        isLoading: legislativeMeetingSessionState.isLoading,
        options: [
          { label: '全部會期', value: 'all', isDeletable: false },
          ..._.map(
            legislativeMeetingSessionState.legislativeMeetingSessions,
            ({
              term,
              startTime,
              endTime,
            }: {
              term: number
              startTime: string
              endTime: string
            }) => ({
              label: `第 ${term} 會期(${formatDateToYearMonth(
                startTime
              )}-${formatDateToYearMonth(endTime)})`,
              value: term.toString(),
            })
          ),
        ],
      },
    ]

    return options
  }, [
    legislativeMeetingState.isLoading,
    legislativeMeetingState.legislativeMeeting,
    legislativeMeetingSessionState.isLoading,
    legislativeMeetingSessionState.legislativeMeetingSessions,
  ])

  // Render a loading state if topic data is missing
  if (!topic) {
    return <div>Loading topic data...</div>
  }

  const openFilter = () => {
    setIsFilterOpen((prev) => !prev)
  }

  const handleSubmit = () => {
    if (!topic || !topic.slug) {
      console.error('Topic data is missing or invalid')
      return
    }

    let sessionTermValue = currentMeetingSession

    try {
      if (filterValues.meetingSession.includes('all')) {
        // Use all available sessions for the selected meeting term
        sessionTermValue =
          legislativeMeetingSessionState.legislativeMeetingSessions.map(
            ({ term }) => term
          )
      } else if (filterValues.meetingSession.length > 0) {
        // Use selected sessions
        sessionTermValue = filterValues.meetingSession.map(Number)
      } else {
        // Fallback to current session if nothing is selected
        console.warn('No meeting sessions selected, using current session')
      }

      const newUrl = `/topics/${topic.slug}?meetingTerm=${
        filterValues.meeting
      }&sessionTerm=${JSON.stringify(sessionTermValue)}`
      router.push(newUrl)
      setIsFilterOpen(false)
    } catch (error) {
      console.error('Error processing filter values:', error)
    }
  }

  return (
    <TopicWrapper>
      <FunctionBarWrapper
        $isHeaderHidden={isHeaderHidden}
        $isHidden={isControllBarHidden}
      >
        <FunctionBar>
          <FunctionBarTitle text={`#${topic?.title} 的相關發言摘要`} />
          <FilterBar onClick={openFilter}>
            <TabletAndAbove>
              <P1Gray700
                text={`第${currentMeetingTerm}屆｜${
                  filterValues.meetingSession.includes('all') ? '全部' : '部分'
                }會期`}
              />
            </TabletAndAbove>
            <FilterButton filterCount={filterCount} />
          </FilterBar>
        </FunctionBar>
      </FunctionBarWrapper>
      <TopicContainer>
        <LeadingContainer ref={leadingRef}>
          <TopicTitle text={`#${topic?.title} 的相關發言摘要`} />
          <FilterBar onClick={openFilter}>
            <P1Gray700
              text={`第${currentMeetingTerm}屆｜${
                filterValues.meetingSession.includes('all') ? '全部' : '部分'
              }會期`}
            />
            <FilterButton filterCount={filterCount} />
          </FilterBar>
        </LeadingContainer>
        <Spacing $height={32} />
        <ContentBlock>
          <DesktopAndAbove>
            <TopicListContainer>
              <TopicList
                legislatorsData={legislatorsData}
                speechesByLegislator={speechesByLegislator}
                currentMeetingTerm={currentMeetingTerm}
                currentMeetingSession={currentMeetingSession}
              />
            </TopicListContainer>
          </DesktopAndAbove>
          <DesktopAside>
            <StatisticsBlock>
              <StatisticsDiv>
                <P1Gray800 text="發言立委人數" />
                <StatisticsNumber>{legislatorCount}</StatisticsNumber>
              </StatisticsDiv>
              <StatisticsDiv>
                <P1Gray800 text="發言總數" />
                <StatisticsNumber>{topic?.speechesCount}</StatisticsNumber>
              </StatisticsDiv>
            </StatisticsBlock>
            <RelatedArticleBlock>
              <H4Title text="相關文章" />
            </RelatedArticleBlock>
            <OthersWatchingBlock>
              <H4Title text="其他人也在看" />
              <OthersWatchingTags>
                {othersWatchingTags.map((topic, idx) => (
                  <Link
                    href={`/topics/${
                      topic.slug
                    }?meetingTerm=${currentMeetingTerm}&sessionTerm=${JSON.stringify(
                      currentMeetingSession
                    )}`}
                    key={`issue-tag-${idx}-${topic.slug}`}
                  >
                    <Issue name={topic.title} />
                  </Link>
                ))}
              </OthersWatchingTags>
            </OthersWatchingBlock>
            <Feedback>
              <span>
                發現什麼問題嗎？透過
                <Link href={'/feedback'} target="_blank">
                  問題回報
                </Link>
                告訴我們，一起讓這裡變得更好！
              </span>
            </Feedback>
          </DesktopAside>
          <TabletAndBelow>
            <StatisticsBlock>
              <StatisticsDiv>
                <P1Gray800 text="發言立委人數" />
                <StatisticsNumber>{legislatorCount}</StatisticsNumber>
              </StatisticsDiv>
              <StatisticsDiv>
                <P1Gray800 text="發言總數" />
                <StatisticsNumber>{topic?.speechesCount}</StatisticsNumber>
              </StatisticsDiv>
            </StatisticsBlock>
            <Spacing $height={32} />
            <TopicListContainer>
              <TopicList
                legislatorsData={legislatorsData}
                speechesByLegislator={speechesByLegislator}
                currentMeetingTerm={currentMeetingTerm}
                currentMeetingSession={currentMeetingSession}
              />
            </TopicListContainer>
            <Spacing $height={8} />
            <RelatedArticleBlock>
              <H4Title text="相關文章" />
            </RelatedArticleBlock>
            <Spacing $height={8} />
            <OthersWatchingBlock>
              <H4Title text="其他人也在看" />
              <OthersWatchingTags>
                {othersWatchingTags.map((topic, idx) => (
                  <Link
                    href={`/topics/${
                      topic.slug
                    }?meetingTerm=${currentMeetingTerm}&sessionTerm=${JSON.stringify(
                      currentMeetingSession
                    )}`}
                    key={`issue-tag-${idx}-${topic.slug}`}
                  >
                    <Issue name={topic.title} />
                  </Link>
                ))}
              </OthersWatchingTags>
            </OthersWatchingBlock>
            <Spacing $height={32} />
            <Feedback>
              <span>
                發現什麼問題嗎？透過
                <Link href={'/feedback'} target="_blank">
                  問題回報
                </Link>
                告訴我們，一起讓這裡變得更好！
              </span>
            </Feedback>
          </TabletAndBelow>
        </ContentBlock>
      </TopicContainer>
      <FilterModal
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        onSubmit={handleSubmit}
        options={filterOptions}
        value={filterValues}
        onChange={handleFilterValueChange}
      />
    </TopicWrapper>
  )
}

export default Topic
