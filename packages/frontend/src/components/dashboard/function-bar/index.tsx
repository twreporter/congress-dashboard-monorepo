import React from 'react'
import styled from 'styled-components'
// components
import Tab from './tab'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { PillButton } from '@twreporter/react-components/lib/button'
import { Hamburger } from '@twreporter/react-components/lib/icon'
import { TabletAndAbove } from '@twreporter/react-components/lib/rwd'

const Bar = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${colorGrayscale.gray300};
`
const TabItem = styled(Tab)`
  margin-left: 40px;
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
`
const Filter = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`

export enum Option {
  Issue,
  Human,
}

type FunctionBarProps = {
  filterString?: string
  currentTab?: Option
  setTab: (tab: Option) => void
}
const FunctionBar: React.FC<FunctionBarProps> = ({
  filterString = '立法院｜第11屆｜全部會期',
  currentTab = Option.Issue,
  setTab,
}: FunctionBarProps) => {
  const openFilter = () => {
    window.alert(`current filter: ${filterString}`)
  }

  return (
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
          leftIconComponent={<Hamburger />} //todo: add filter icon & add release branch
        />
      </Filter>
    </Bar>
  )
}
export default FunctionBar
