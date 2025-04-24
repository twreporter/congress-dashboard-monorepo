'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
// components
import FilterModal, {
  type FilterModalValueType,
  type FilterOption,
} from '@/components/filter-modal'
import Tab from '@/components/dashboard/function-bar/tab'
import FilterButton from '@/components/button/filter-button'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import {
  TabletAndAbove,
  MobileOnly,
} from '@twreporter/react-components/lib/rwd'
import mq from '@twreporter/core/lib/utils/media-query'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// z-index
import { ZIndex } from '@/styles/z-index'
// constants
import { HEADER_HEIGHT } from '@/constants/header'
// utils
import { getImageLink } from '@/fetchers/utils'
import { formatDateToYearMonth } from '@/utils/date-formatters'
// fetcher
import { useLegislativeMeetingSession } from '@/fetchers/legislative-meeting'
import useCommittee from '@/fetchers/committee'
// type
import { type partyData } from '@/fetchers/party'
import { type LegislativeMeeting } from '@/fetchers/server/legislative-meeting'
import type { OptionGroup } from '@/components/selector/types'
// selector
import { SelectorType } from '@/components/selector'
// constants
import {
  MemberType,
  MEMBER_TYPE_LABEL,
  CITY_OPTIONS,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
// component
import PartyTag, { TagSize } from '@/components/dashboard/card/party-tag'
// lodash
import { isEqual, map } from 'lodash'
const _ = {
  map,
  isEqual,
}

const HorizaontalLine = styled.div<{
  $isHeaderAboveTab: boolean
  $isHide?: boolean
  $isHeaderHidden: boolean
}>`
  ${(props) => (props.$isHide ? 'display: none;' : '')}
  width: 100%;
  border-top: 1px solid ${colorGrayscale.gray300};
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  ${mq.hdOnly`
    ${(props) =>
      props.$isHeaderAboveTab || props.$isHeaderHidden ? 'width: 1280px;' : ''}
  `}
  ${mq.desktopOnly`
    ${(props) =>
      props.$isHeaderAboveTab || props.$isHeaderHidden ? '' : 'width: 928px;'}
  `}
  ${mq.mobileOnly`
    ${(props) =>
      props.$isHeaderAboveTab || props.$isHeaderHidden ? 'width: 100vw;' : ''}
  `}
`
const StickyBar = styled.div<{
  $isHeaderHidden: boolean
}>`
  position: sticky;
  transition: all 300ms ease-in-out;
  top: ${(props) => (props.$isHeaderHidden ? '0px' : `${HEADER_HEIGHT}px`)};
  background-color: ${colorGrayscale.gray100};
  z-index: ${ZIndex.Bar};
  width: 928px;

  ${mq.desktopAndBelow`
    width: 100%;
  `}

  &:before {
    content: '';
    width: 100vw;
    height: 100%;
    background-color: ${colorGrayscale.gray100};
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }
`
const Box = styled.div`
  width: 928px;
  display: flex;
  flex-direction: column;
  justify-self: center;
  gap: 20px;
  ${mq.tabletAndBelow`
    width: 100%;
  `}
`
const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const TabItem = styled(Tab)`
  margin-left: 40px;

  ${mq.tabletOnly`
    margin-left: 32px;
  `}
  ${mq.mobileOnly`
    margin-left: 24px;
  `}

  &:first-child {
    margin: 0;
  }
`
const Tabs = styled.div`
  display: flex;
`
const FilterString = styled.div`
  color: ${colorGrayscale.gray700};
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  margin-right: 20px;

  ${mq.mobileOnly`
    font-size: 14px;  
  `}
`
const Filter = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`
const MobileOnlyBox = styled(MobileOnly)`
  width: 100%;
`

export enum Option {
  Issue,
  Human,
}

type FunctionBarProps = {
  currentTab?: Option
  setTab: (tab: Option) => void
  className?: string
  parties: partyData[]
  meetings: LegislativeMeeting[]
  onChangeFilter?: (filterModalValue: FilterModalValueType) => void
}

type CommitteeOptionGroup = Record<string, OptionGroup>

const OptionIcon: React.FC<{ url: string }> = ({ url }) => {
  return <PartyTag size={TagSize.S} avatar={url} />
}

const FunctionBar: React.FC<FunctionBarProps> = ({
  currentTab = Option.Issue,
  setTab,
  parties,
  meetings,
  className,
  onChangeFilter,
}: FunctionBarProps) => {
  const latestMettingTerm = useMemo(() => `${meetings[0]?.term}`, [meetings])
  const openFilter = () => {
    setIsFilterOpen((prev) => !prev)
  }
  const tabRef = useRef<HTMLDivElement>(null)
  const { setTabElement, isHeaderHidden, isHeaderAboveTab } = useScrollContext()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterString, setFilterString] = useState(
    `立法院｜第${latestMettingTerm}屆｜全部會期`
  )
  const [filterCount, setFilterCount] = useState(0)
  const [filterValues, setFilterValues] = useState<FilterModalValueType>({
    department: 'legislativeYuan',
    meeting: latestMettingTerm,
    meetingSession: ['all'],
    constituency: [],
    party: [],
    committee: [],
  })

  const sessionState = useLegislativeMeetingSession(
    filterValues.meeting as string
  )
  const committeeState = useCommittee()

  // Generate filter options
  const getFilterOptions = (): FilterOption[] => {
    const options: FilterOption[] = [
      {
        type: SelectorType.Single,
        disabled: true,
        label: '單位',
        key: 'department',
        defaultValue: 'legislativeYuan',
        options: [{ label: '立法院', value: 'legislativeYuan' }],
      },
      {
        type: SelectorType.Single,
        disabled: false,
        label: '屆期',
        key: 'meeting',
        defaultValue: `${latestMettingTerm}`,
        options: meetings.map(({ term }) => ({
          label: `第 ${term} 屆`,
          value: `${term}`,
        })),
      },
      {
        type: SelectorType.Multiple,
        disabled: false,
        defaultValue: ['all'],
        label: '會期',
        key: 'meetingSession',
        isLoading: sessionState.isLoading,
        options: [
          { label: '全部會期', value: 'all', isDeletable: false },
        ].concat(
          sessionState.legislativeMeetingSessions.map(
            ({ id, term, startTime, endTime }) => ({
              label: `第 ${term} 會期(${formatDateToYearMonth(
                startTime
              )}-${formatDateToYearMonth(endTime)})`,
              value: `${id}`,
              isDeletable: true,
            })
          )
        ),
      },
      {
        type: SelectorType.Multiple,
        disabled: false,
        label: '選區',
        key: 'constituency',
        options: [
          {
            groupName: '不分區',
            options: [
              { label: '不分區', value: MemberType.NationwideAndOverseas },
            ],
          },
          {
            groupName: '原住民',
            options: [
              {
                label: MEMBER_TYPE_LABEL[MemberType.LowlandAboriginal],
                value: MemberType.LowlandAboriginal,
              },
              {
                label: MEMBER_TYPE_LABEL[MemberType.HighlandAboriginal],
                value: MemberType.HighlandAboriginal,
              },
            ],
          },
          { groupName: '區域', options: CITY_OPTIONS },
        ],
      },
      {
        type: SelectorType.Multiple,
        disabled: false,
        label: '黨籍',
        key: 'party',
        isLoading: false,
        options: _.map(parties, (party) => ({
          label: party.name,
          value: `${party.id}`,
          prefixIcon: <OptionIcon url={getImageLink(party)} />,
        })),
      },
      {
        type: SelectorType.Multiple,
        disabled: false,
        label: '委員會',
        key: 'committee',
        isLoading: committeeState.isLoading,
        options: Object.values(
          committeeState.committees.reduce(
            (acc: CommitteeOptionGroup, committee): CommitteeOptionGroup => {
              if (!acc[committee.type]) {
                acc = {
                  ...acc,
                  [committee.type]: {
                    groupName: committee.type === 'ad-hoc' ? '特種' : '常設',
                    options: [],
                  },
                }
              }
              acc[committee.type].options.push({
                label: committee.name,
                value: committee.slug,
              })
              return acc
            },
            {} as CommitteeOptionGroup
          )
        ) as OptionGroup[],
      },
    ]

    return options
  }

  const handleSubmit = (filterModalValue: FilterModalValueType) => {
    console.log('filterValues', filterValues)
    console.log('filterModalValue', filterModalValue)
    if (_.isEqual(filterModalValue, filterValues)) {
      console.log('the same')
      return
    }
    setFilterValues(filterModalValue)

    const meetingString = filterModalValue.meeting
      ? `第${filterModalValue.meeting}屆`
      : `第${latestMettingTerm}屆`
    const meetingSessionString = filterModalValue.meetingSession?.length
      ? filterModalValue.meetingSession[0] === 'all'
        ? '全部會期'
        : '部分會期'
      : '全部會期'
    const totalCount =
      (filterModalValue.constituency as string[])?.length +
      (filterModalValue.party as string[])?.length +
      (filterModalValue.committee as string[])?.length

    setFilterString(`立法院｜${meetingString}｜${meetingSessionString}`)
    setFilterCount(totalCount)

    if (typeof onChangeFilter === 'function') {
      onChangeFilter(filterModalValue)
    }
  }

  useEffect(() => {
    if (tabRef.current) {
      setTabElement(tabRef.current)
    }
  }, [setTabElement, tabRef])

  return (
    <>
      <StickyBar
        $isHeaderHidden={isHeaderHidden}
        ref={tabRef}
        className={className}
      >
        <HorizaontalLine
          $isHeaderAboveTab={isHeaderAboveTab}
          $isHide={!isHeaderAboveTab}
          $isHeaderHidden={isHeaderHidden}
        />
        <Box>
          <Bar>
            <Tabs>
              <TabItem
                text={'看議題'}
                selected={currentTab === Option.Issue}
                onClick={() => setTab(Option.Issue)}
              />
              <TabItem
                text={'看立委'}
                selected={currentTab === Option.Human}
                onClick={() => setTab(Option.Human)}
              />
            </Tabs>
            <Filter onClick={openFilter}>
              <TabletAndAbove>
                <FilterString>{filterString}</FilterString>
              </TabletAndAbove>
              <FilterButton filterCount={filterCount} />
            </Filter>
          </Bar>
          <FilterModal
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
            onSubmit={handleSubmit}
            options={getFilterOptions()}
            value={filterValues}
          />
        </Box>
        <HorizaontalLine
          $isHeaderAboveTab={isHeaderAboveTab}
          $isHeaderHidden={isHeaderHidden}
        />
      </StickyBar>
      <MobileOnlyBox className={className}>
        <FilterString onClick={openFilter}>{filterString}</FilterString>
      </MobileOnlyBox>
    </>
  )
}
export default FunctionBar
