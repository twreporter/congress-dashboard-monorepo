import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
// components
import FliterModal, { type FilterModalValueType } from './filter-modal'
import Tab from '@/components/dashboard/function-bar/tab'
// @twreporter
import {
  colorGrayscale,
  colorBrand,
} from '@twreporter/core/lib/constants/color'
import { PillButton } from '@twreporter/react-components/lib/button'
import {
  TabletAndAbove,
  MobileOnly,
} from '@twreporter/react-components/lib/rwd'
import { P4 } from '@twreporter/react-components/lib/text/paragraph'
import { Filter as FilterIcon } from '@twreporter/react-components/lib/icon'
import mq from '@twreporter/core/lib/utils/media-query'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// z-index
import { ZIndex } from '@/styles/z-index'
// constants
import { HEADER_HEIGHT } from '@/constants/header'

const Box = styled.div<{
  $isHeaderHidden: boolean
  $isHeaderAboveTab: boolean
}>`
  width: 928px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  transition: all 300ms ease-in-out;
  top: ${(props) => (props.$isHeaderHidden ? '0px' : `${HEADER_HEIGHT}px`)};
  background-color: ${colorGrayscale.gray100};
  z-index: ${ZIndex.Bar};
  border-top: ${(props) =>
    props.$isHeaderAboveTab
      ? `1px solid ${colorGrayscale.gray300}`
      : '1px solid transparent'};

  ${mq.tabletAndBelow`
    width: 100%;
  `}
`
const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${colorGrayscale.gray300};
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

const FilterCountIcon = styled.div`
  background-color: ${colorBrand.heavy};
  height: 20px;
  width: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const P4White = styled(P4)`
  color: ${colorGrayscale.white};
`

export enum Option {
  Issue,
  Human,
}

type FunctionBarProps = {
  currentTab?: Option
  setTab: (tab: Option) => void
}
const FunctionBar: React.FC<FunctionBarProps> = ({
  currentTab = Option.Issue,
  setTab,
}: FunctionBarProps) => {
  const openFilter = () => {
    setIsFilterOpen((prev) => !prev)
  }
  const searchRef = useRef<HTMLDivElement>(null)
  const { setTabElement, isHeaderHidden, isHeaderAboveTab } = useScrollContext()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterString, setFilterString] = useState('立法院｜第11屆｜全部會期')
  const [filterCount, setFilterCount] = useState(0)

  const handleSubmit = (filterModalValue: FilterModalValueType) => {
    const meetingString = filterModalValue.meeting
      ? `第${filterModalValue.meeting}屆`
      : '第11屆'
    const meetingSessionString = filterModalValue.meetingSession.length
      ? filterModalValue.meetingSession[0] === 'all'
        ? '全部會期'
        : '部分會期'
      : '全部會期'
    const totalCount =
      filterModalValue.constituency.length +
      filterModalValue.party.length +
      filterModalValue.committee.length
    setFilterString(`立法院｜${meetingString}｜${meetingSessionString}`)
    setFilterCount(totalCount)
  }
  const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRNCH

  useEffect(() => {
    if (searchRef.current) {
      setTabElement(searchRef.current)
    }
  }, [setTabElement, searchRef])

  return (
    <Box
      $isHeaderHidden={isHeaderHidden}
      $isHeaderAboveTab={isHeaderAboveTab}
      ref={searchRef}
    >
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
          <PillButton
            theme={PillButton.THEME.normal}
            type={PillButton.Type.SECONDARY}
            size={PillButton.Size.L}
            text={'篩選'}
            leftIconComponent={<FilterIcon releaseBranch={releaseBranch} />}
            rightIconComponent={
              filterCount > 0 ? (
                <FilterCountIcon>
                  <P4White text={filterCount} />
                </FilterCountIcon>
              ) : null
            }
          />
        </Filter>
      </Bar>
      <MobileOnly>
        <FilterString onClick={openFilter}>{filterString}</FilterString>
      </MobileOnly>
      <FliterModal
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}
export default FunctionBar
