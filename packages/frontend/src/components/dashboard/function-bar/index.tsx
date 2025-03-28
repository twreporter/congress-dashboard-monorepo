import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
// components
import FliterModal, { type FilterModalValueType } from './filter-modal'
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
          <FliterModal
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
            onSubmit={handleSubmit}
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
