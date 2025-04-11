'use client'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
// @twerporter
import {
  colorOpacity,
  colorGrayscale,
} from '@twreporter/core/lib/constants/color'
import { H5 } from '@twreporter/react-components/lib/text/headline'
import { Cross } from '@twreporter/react-components/lib/icon'
import { PillButton } from '@twreporter/react-components/lib/button'
import mq from '@twreporter/core/lib/utils/media-query'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
// component
import {
  SelectorType,
  SingleSelect,
  MultipleSelect,
} from '@/components/selector'
import type { OptionGroup, Option } from '@/components/selector/types'
// z-index
import { ZIndex } from '@/styles/z-index'

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0px;
  right: 0px;
  width: 100vw;
  height: 100vh;
  background-color: ${colorOpacity['black_0.2']};
  justify-content: center;
  align-items: center;
  z-index: ${ZIndex.FilterModal};
`

const Filter = styled.div`
  background-color: ${colorGrayscale.white};
  width: 100%;
  ${mq.tabletAndAbove`
    max-width: 480px;
    border-radius: 8px;
    box-shadow: 0px 0px 24px 0px ${colorOpacity['black_0.1']};
    `}
  ${mq.mobileOnly`
    height: 100%;
    overflow: auto;
  `}
`

const Header = styled.div`
  display: flex;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: ${colorGrayscale.gray800};
  position: relative;
  background-color: ${colorGrayscale.white};
  ${mq.mobileOnly`
    border-bottom: 1px solid ${colorGrayscale.gray300};
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 1;
  `}
`

const CrossIcon = styled.div`
  position: absolute;
  right: 16px;
  height: 24px;
  width: 24px;
  svg {
    background-color: ${colorGrayscale.gray600};
  }
  &:hover {
    cursor: pointer;
  }
`

const Footer = styled.div`
  display: flex;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background-color: ${colorGrayscale.white};
  ${mq.mobileOnly`
    padding: 24px;
    gap: 10px;
    border-top: 1px solid ${colorGrayscale.gray300};
    position:fixed;
    width: 100%;
    bottom: 0;
  `}
`

const StyledPillButton = styled(PillButton)`
  width: 144px !important;
  justify-content: center;
  ${mq.mobileOnly`
    width: 100% !important;
  `}
`

const SelectorsContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 16px 24px;
  gap: 24px;
  flex-direction: column;
  ${mq.mobileOnly`
    gap: 20px;
    margin-bottom: 91px;
    margin-top: 58.5px;
  `}
`

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  ${mq.mobileOnly`
    flex-direction: column;
    gap: 8px;
    align-items: start;
  `}
`

const Label = styled(P2)`
  color: ${colorGrayscale.gray800};
  flex: 0 0 25%;
  max-width: 42px;
  ${mq.tabletAndAbove`
    display: block !important;
    text-align: justify;
    text-align-last: justify;
  `}
  ${mq.mobileOnly`
    width: 100%;
  `}
`

const SelectorContainer = styled.div`
  flex: 1;
  width: 100%;
`

export type FilterOption = {
  type: SelectorType
  disabled?: boolean
  label: string
  key: string
  options: Option[] | OptionGroup[]
  defaultValue?: string | string[]
  isLoading?: boolean
}

export type FilterModalValueType = {
  [key: string]: string | string[]
}

type FilterModelProps = {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  onSubmit: (v: FilterModalValueType) => void
  options: FilterOption[]
  initialValues?: FilterModalValueType
  value?: FilterModalValueType
  onChange?: (v: FilterModalValueType) => void
}

const FilterModal: React.FC<FilterModelProps> = ({
  isOpen,
  setIsOpen,
  onSubmit,
  options,
  initialValues = {},
  value,
  onChange,
}) => {
  // Create a default value object based on the provided options
  const getDefaultValues = () => {
    const defaults: FilterModalValueType = {}
    options.forEach((option) => {
      if (option.type === SelectorType.Single) {
        defaults[option.key] = option.defaultValue || ''
      } else if (option.type === SelectorType.Multiple) {
        defaults[option.key] = option.defaultValue || []
      }
    })
    return { ...defaults, ...initialValues }
  }

  const [filterValue, setFilterValue] = useState<FilterModalValueType>(
    value || getDefaultValues()
  )

  // Update internal state if value is provided and changes
  useEffect(() => {
    if (value) {
      setFilterValue(value)
    }
  }, [value])

  // Handle internal state changes
  const handleValueChange = (key: string, newValue: string | string[]) => {
    const updatedValue = {
      ...filterValue,
      [key]: newValue,
    }
    setFilterValue(updatedValue)

    // If onChange is provided, call it
    if (onChange) {
      onChange(updatedValue)
    }
  }

  const handleSubmitClick = () => {
    onSubmit(filterValue)
    setIsOpen(false)
  }

  const handleResetClick = () => {
    const defaultValues = getDefaultValues()
    setFilterValue(defaultValues)
    if (typeof onChange === 'function') {
      onChange(defaultValues)
    }
  }

  const handleCrossClick = () => {
    setIsOpen(false)
  }

  return (
    <ModalContainer $isOpen={isOpen}>
      <Filter>
        <Header>
          <H5 text="篩選" />
          <CrossIcon onClick={handleCrossClick}>
            <Cross />
          </CrossIcon>
        </Header>
        <SelectorsContainer>
          {options.map(
            (
              {
                type,
                disabled,
                label,
                key: optionKey,
                options: selectOptions,
                isLoading,
                defaultValue,
              },
              idx
            ) => {
              if (type === SelectorType.Single) {
                return (
                  <SelectContainer key={`single-select-${optionKey}-${idx}`}>
                    <Label text={label} />
                    <SelectorContainer>
                      <SingleSelect
                        disabled={disabled}
                        options={selectOptions}
                        value={filterValue[optionKey] as string}
                        onChange={(selectedValue) =>
                          handleValueChange(optionKey, selectedValue)
                        }
                        loading={isLoading}
                      />
                    </SelectorContainer>
                  </SelectContainer>
                )
              } else if (type === SelectorType.Multiple) {
                return (
                  <SelectContainer key={`multi-select-${optionKey}-${idx}`}>
                    <Label text={label} />
                    <SelectorContainer>
                      <MultipleSelect
                        disabled={disabled}
                        options={selectOptions}
                        value={filterValue[optionKey] as string[]}
                        defaultValue={defaultValue as string[]}
                        onChange={(selectedValue) =>
                          handleValueChange(optionKey, selectedValue)
                        }
                        loading={isLoading}
                      />
                    </SelectorContainer>
                  </SelectContainer>
                )
              }
            }
          )}
        </SelectorsContainer>
        <Footer>
          <StyledPillButton
            text="重設"
            size={PillButton.Size.L}
            type={PillButton.Type.SECONDARY}
            onClick={handleResetClick}
          />
          <StyledPillButton
            text="確定"
            size={PillButton.Size.L}
            onClick={handleSubmitClick}
          />
        </Footer>
      </Filter>
    </ModalContainer>
  )
}

export default FilterModal
