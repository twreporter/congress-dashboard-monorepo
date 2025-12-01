'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
// @twreporter
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import {
  colorGrayscale,
  colorBrand,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { Arrow } from '@twreporter/react-components/lib/icon'
// hooks
import useOutsideClick from '@/hooks/use-outside-click'
// types
import { ValuesOf } from '@/types'

const TabWrapper = styled.div`
  position: relative;
`

const TabButton = styled.div<{ $selected: boolean }>`
  display: inline-flex;
  padding: 20px 0px;
  padding-bottom: 18px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) => (props.$selected ? colorGrayscale.gray800 : 'transparent')};

  p {
    color: ${colorGrayscale.gray800};
  }
  svg {
    background-color: ${colorGrayscale.gray800};
  }
  &:hover {
    border-bottom-color: ${(props) =>
      props.$selected ? colorBrand.dark : 'transparent'};
    p {
      color: ${colorBrand.dark};
    }
    svg {
      background-color: ${colorBrand.dark};
    }
  }
`

const DropdownMenu = styled.div`
  position: absolute;
  margin-top: 8px;
  width: 160px;
  padding: 8px 0px;
  border-radius: 4px;
  background: ${colorGrayscale.white};
  box-shadow: 0px 2px 16px 0px ${colorOpacity['black_0.2']};
  top: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
`

const DropdownItem = styled.div<{ $selected?: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: ${colorGrayscale.gray100};
  }
  ${(props) =>
    props.$selected
      ? `
    background-color: #F0D5BE80;
  `
      : `
    background-color: ${colorGrayscale.white};
  `}
`

const TAB_TYPE = {
  single: 'single',
  dropdown: 'dropdown',
} as const

type TabType = ValuesOf<typeof TAB_TYPE>

export type DropdownOption = {
  label: string
  value: string
  isSelected?: boolean
}

export type TabProps = {
  label: string
  isSelected: boolean
  onClick: () => void
  type: TabType
  dropdownOptions?: DropdownOption[]
  onDropdownItemClick?: (option: DropdownOption) => void
  currentDropdownValue?: string
}

const Tab: React.FC<TabProps> & { Type: typeof TAB_TYPE } = ({
  label,
  isSelected,
  onClick,
  type,
  dropdownOptions = [],
  onDropdownItemClick,
  currentDropdownValue,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const tabRef = useOutsideClick(() => {
    setIsDropdownOpen(false)
  })

  const handleTabClick = () => {
    if (type === TAB_TYPE.single) {
      onClick()
    } else if (type === TAB_TYPE.dropdown) {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  const handleDropdownItemClick = (option: DropdownOption) => {
    if (onDropdownItemClick) {
      onDropdownItemClick(option)
    }
    setIsDropdownOpen(false)
  }

  if (type === TAB_TYPE.single) {
    return (
      <TabButton $selected={isSelected} onClick={handleTabClick}>
        <P1 text={label} weight={P1.Weight.BOLD} />
      </TabButton>
    )
  }

  return (
    <TabWrapper ref={tabRef}>
      <TabButton $selected={isSelected} onClick={handleTabClick}>
        <P1 text={label} weight={P1.Weight.BOLD} />
        <Arrow
          direction={isDropdownOpen ? Arrow.Direction.UP : Arrow.Direction.DOWN}
        />
      </TabButton>
      {isDropdownOpen && (
        <DropdownMenu>
          {dropdownOptions.map((option) => (
            <DropdownItem
              key={option.value}
              $selected={currentDropdownValue === option.value}
              onClick={() => handleDropdownItemClick(option)}
            >
              <P1
                text={option.label}
                weight={
                  currentDropdownValue === option.value
                    ? P1.Weight.BOLD
                    : P1.Weight.NORMAL
                }
              />
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </TabWrapper>
  )
}

Tab.Type = TAB_TYPE

export default Tab
