import React, { useRef, useEffect, useState } from 'react'
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
// fetcher
import useParty, { type partyData } from '@/fetchers/party'
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
import map from 'lodash/map'

const _ = {
  map,
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
}

const OptionIcon: React.FC<{ url: string }> = ({ url }) => {
  return <PartyTag size={TagSize.S} avatar={url} />
}

const FunctionBar: React.FC<FunctionBarProps> = ({
  currentTab = Option.Issue,
  setTab,
  className,
}: FunctionBarProps) => {
  const openFilter = () => {
    setIsFilterOpen((prev) => !prev)
  }
  const tabRef = useRef<HTMLDivElement>(null)
  const { setTabElement, isHeaderHidden, isHeaderAboveTab } = useScrollContext()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterString, setFilterString] = useState('立法院｜第11屆｜全部會期')
  const [filterCount, setFilterCount] = useState(0)
  const [filterValues, setFilterValues] = useState<FilterModalValueType>({
    department: 'legislativeYuan',
    meeting: '11',
    meetingSession: ['all'],
    constituency: [],
    party: [],
    committee: [],
  })

  // Get party data
  const partyState = useParty()

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
        defaultValue: '11',
        options: [
          { label: '第 10 屆', value: '10' },
          { label: '第 11 屆', value: '11' },
        ],
      },
      {
        type: SelectorType.Multiple,
        disabled: false,
        defaultValue: ['all'],
        label: '會期',
        key: 'meetingSession',
        options: [
          { label: '全部會期', value: 'all', isDeletable: false },
          { label: '第 1 會期(2020/9-2022/10)', value: '1' },
          { label: '第 2 會期(2022/10-2023/2)', value: '2' },
          { label: '第 3 會期(2023/2-2023/6)', value: '3' },
        ],
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
        isLoading: partyState.isLoading,
        options: _.map(
          partyState.party,
          ({ slug, name, imageLink, image }: partyData) => {
            const selfHostImage = image?.imageFile?.url
            const imageUrl =
              imageLink ||
              (selfHostImage
                ? `${process.env.NEXT_PUBLIC_IMAGE_HOST}${selfHostImage}`
                : '')
            const prefixIcon = <OptionIcon url={imageUrl} />
            return {
              label: name,
              value: slug,
              prefixIcon,
            }
          }
        ),
      },
      {
        type: SelectorType.Multiple,
        disabled: false,
        label: '委員會',
        key: 'committee',
        options: [
          {
            groupName: '常設',
            options: [
              { label: '內政委員會', value: 'committee-1' },
              { label: '社會福利及衛生環境委員會', value: 'committee-3' },
            ],
          },
          {
            groupName: '特種',
            options: [
              { label: '經費稽核委員會', value: 'committee-2' },
              { label: '紀律委員會', value: 'committee-4' },
            ],
          },
        ],
      },
    ]

    return options
  }

  const handleSubmit = (filterModalValue: FilterModalValueType) => {
    setFilterValues(filterModalValue)

    const meetingString = filterModalValue.meeting
      ? `第${filterModalValue.meeting}屆`
      : '第11屆'
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
            onChange={setFilterValues}
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
