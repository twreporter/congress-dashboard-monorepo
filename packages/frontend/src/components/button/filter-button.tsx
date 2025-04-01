'use client'
import React from 'react'
import styled from 'styled-components'
// twreporter
import { PillButton } from '@twreporter/react-components/lib/button'
import {
  colorBrand,
  colorGrayscale,
} from '@twreporter/core/lib/constants/color'
import { P4 } from '@twreporter/react-components/lib/text/paragraph'
import { Filter as FilterIcon } from '@twreporter/react-components/lib/icon'

const FilterCountIcon = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`
/* todo: support div icon color in @twreporter/react-components */
const BasePillButton = styled(PillButton)`
  height: 40px;
  ${FilterCountIcon} {
    background-color: ${colorBrand.heavy};
  }

  &:hover {
    ${FilterCountIcon} {
      background-color: ${colorBrand.dark};
    }
  }
`

const P4White = styled(P4)`
  color: ${colorGrayscale.white};
`

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRNCH
type FilterButtonProps = {
  filterCount: number
}
const FilterButton: React.FC<FilterButtonProps> = ({ filterCount }) => (
  <BasePillButton
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
)
export default FilterButton
