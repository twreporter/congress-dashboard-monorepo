'use client'

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useContext,
  forwardRef,
  useCallback,
} from 'react'
import styled from 'styled-components'
// components
import FilterModal from '@/components/filter-modal'
import Tab from '@/components/dashboard/function-bar/tab'
import FilterButton from '@/components/button/filter-button'
import PartyTag from '@/components/dashboard/card/party-tag'
// enum
import { Option, TagSize } from '@/components/dashboard/enum'
import { SelectorType } from '@/components/selector'
// context
import { useScrollContext } from '@/contexts/scroll-context'
import { CouncilDashboardContext } from '@/components/council-dashboard/context'
// z-index
import { ZIndex } from '@/styles/z-index'
// constants
import { HEADER_HEIGHT } from '@/constants/header'
// utils
import { getImageLink } from '@/fetchers/utils'
// fetcher
// type
import type { PartyData } from '@/types/party'
import type { LegislativeMeeting } from '@/types/legislative-meeting'
import type {
  FilterOption,
  FilterModalValueType,
} from '@/components/dashboard/type'
import type { CouncilDistrict } from '@/types/council'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import {
  TabletAndAbove,
  MobileOnly,
} from '@twreporter/react-components/lib/rwd'
import mq from '@twreporter/core/lib/utils/media-query'
import {
  MEMBER_TYPE,
  MEMBER_TYPE_LABEL,
} from '@twreporter/congress-dashboard-shared/lib/constants/council-member'
import { getDistrictsByCity } from '@twreporter/congress-dashboard-shared/lib/constants/city-district'
import type { City } from '@twreporter/congress-dashboard-shared/lib/constants/city'
// lodash
import { isEqual, map } from 'lodash'
import { getCouncilName } from '@/components/open/config'
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

  ${mq.tabletAndBelow`
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

type FunctionBarProps = {
  setTab: (tab: Option) => void
  className?: string
  parties: PartyData[]
  meetings: LegislativeMeeting[]
  onChangeFilter?: (filterModalValue: FilterModalValueType) => void
  districtSlug: string
}

const OptionIcon: React.FC<{ url: string }> = ({ url }) => {
  return <PartyTag size={TagSize.S} avatar={url} />
}

const FunctionBar = forwardRef<HTMLDivElement, FunctionBarProps>(
  (
    { setTab, parties, meetings, className, onChangeFilter, districtSlug },
    ref
  ) => {
    const { tabType, filterValues, setFilterValues } = useContext(
      CouncilDashboardContext
    )
    const latestMettingTerm = useMemo(() => `${meetings[0]?.term}`, [meetings])
    const openFilter = () => {
      setIsFilterOpen((prev) => !prev)
    }
    const tabRef = useRef<HTMLDivElement>(null)

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        tabRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    const { setTabElement, isHeaderHidden, isHeaderAboveTab } =
      useScrollContext()
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterString, setFilterString] = useState(
      `${getCouncilName(
        districtSlug as CouncilDistrict
      )}｜第${latestMettingTerm}屆`
    )
    const [filterCount, setFilterCount] = useState(0)
    const [currentFilterValue, setCurrentFilterValue] = useState(filterValues)

    // Generate filter options
    const getFilterOptions = (): FilterOption[] => {
      const options: FilterOption[] = [
        {
          type: SelectorType.Multiple,
          disabled: false,
          label: '行政區',
          key: 'administrativeDistrict',
          options: [...getDistrictsByCity(districtSlug as City)],
        },
        {
          type: SelectorType.Single,
          disabled: false,
          label: '身份別',
          key: 'type',
          options: [
            {
              label: MEMBER_TYPE_LABEL[MEMBER_TYPE.lowlandAboriginal],
              value: MEMBER_TYPE.lowlandAboriginal,
            },
            {
              label: MEMBER_TYPE_LABEL[MEMBER_TYPE.highlandAboriginal],
              value: MEMBER_TYPE.highlandAboriginal,
            },
            {
              label: '非原住民',
              value: MEMBER_TYPE.constituency,
            },
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
      ]

      return options
    }

    const handleChange = ({
      meeting,
      meetingSession,
      ...other
    }: FilterModalValueType) => {
      const newSession =
        meeting === currentFilterValue.meeting ? meetingSession : ['all']
      setCurrentFilterValue({
        meeting,
        meetingSession: newSession,
        ...other,
      })
    }

    const handleSubmit = (filterModalValue: FilterModalValueType) => {
      if (_.isEqual(filterModalValue, filterValues)) {
        return
      }
      setFilterValues(filterModalValue)

      const meetingString = filterModalValue.meeting
        ? `第${filterModalValue.meeting}屆`
        : `第${latestMettingTerm}屆`
      const totalCount =
        ((filterModalValue.administrativeDistrict as string[])?.length || 0) +
        (filterModalValue.type && filterModalValue.type !== 'all' ? 1 : 0) +
        ((filterModalValue.party as string[])?.length || 0)

      setFilterString(
        `${getCouncilName(districtSlug as CouncilDistrict)}｜${meetingString}`
      )
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
          ref={mergedRef}
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
                  text={'看議員'}
                  selected={tabType === Option.Human}
                  onClick={() => setTab(Option.Human)}
                />
                <TabItem
                  text={'看議題'}
                  selected={tabType === Option.Issue}
                  onClick={() => setTab(Option.Issue)}
                />
              </Tabs>
              {tabType === Option.Human ? (
                <Filter onClick={openFilter}>
                  <TabletAndAbove>
                    <FilterString>{filterString}</FilterString>
                  </TabletAndAbove>
                  <FilterButton filterCount={filterCount} />
                </Filter>
              ) : (
                <TabletAndAbove>
                  <FilterString>{filterString}</FilterString>
                </TabletAndAbove>
              )}
            </Bar>
            {isFilterOpen && (
              <FilterModal
                isOpen={isFilterOpen}
                setIsOpen={setIsFilterOpen}
                onSubmit={handleSubmit}
                onChange={handleChange}
                options={getFilterOptions()}
                value={currentFilterValue}
              />
            )}
          </Box>
          <HorizaontalLine
            $isHeaderAboveTab={isHeaderAboveTab}
            $isHeaderHidden={isHeaderHidden}
          />
        </StickyBar>
        <MobileOnlyBox className={className}>
          {tabType === Option.Human ? (
            <FilterString onClick={openFilter}>{filterString}</FilterString>
          ) : (
            <FilterString>{filterString}</FilterString>
          )}
        </MobileOnlyBox>
      </>
    )
  }
)

FunctionBar.displayName = 'FunctionBar'

export default FunctionBar
