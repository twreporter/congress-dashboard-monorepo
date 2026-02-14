'use client'
import React, {
  useCallback,
  useMemo,
  RefObject,
  useRef,
  useState,
  useEffect,
} from 'react'
// @twreporter
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
// type
import type { Option, OptionGroup, ValueType } from './types'
import { isOptionGroup } from './utils'
import {
  DropdownMenuContainer,
  OptionItem,
  OptionItemGroupName,
  OptionItemLabel,
  OptionItemPrefixIcon,
  NoResults,
  CheckMark,
} from './styles'
import CheckIcon from './check-icon'
// lodash
import { throttle } from 'lodash'

const _ = {
  throttle,
}

type DropdownMenuProps = {
  options: OptionGroup[] | Option[]
  value: ValueType | ValueType[]
  filterOptions: (options: Option[]) => Option[]
  handleSelect: (option: Option) => void
  isMultiple?: boolean
  selectContainerRef: RefObject<HTMLDivElement | null>
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  options,
  value,
  filterOptions,
  handleSelect,
  isMultiple = false,
  selectContainerRef,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showAbove, setShowAbove] = useState(false)

  useEffect(() => {
    const checkPosition = _.throttle(() => {
      if (!selectContainerRef.current || !dropdownRef.current) return
      const selectRect = selectContainerRef.current.getBoundingClientRect()
      const dropdownHeight = dropdownRef.current.offsetHeight
      const windowHeight = window.innerHeight
      const spaceBelow = windowHeight - selectRect.bottom
      const spaceAbove = selectRect.top

      // Add some padding (e.g., 20px) for better visual appearance
      const padding = 20

      // If there's not enough space below, and there's more space above, show above
      setShowAbove(
        spaceBelow < dropdownHeight + padding && spaceAbove > spaceBelow
      )
    }, 100)

    checkPosition()
    window.addEventListener('scroll', checkPosition)
    window.addEventListener('resize', checkPosition)

    return () => {
      checkPosition.cancel()
      window.removeEventListener('scroll', checkPosition)
      window.removeEventListener('resize', checkPosition)
    }
  }, [selectContainerRef])

  const isSelected = useCallback(
    (optionValue: ValueType): boolean => {
      if (isMultiple) {
        return Array.isArray(value) && value.includes(optionValue)
      }
      return value === optionValue
    },
    [isMultiple, value]
  )

  const renderedOptions = useMemo(() => {
    if (isOptionGroup(options)) {
      const filteredGroups: Record<string, Option[]> = {}
      let hasResults = false

      // Filter options within each group
      options.forEach(({ groupName, options: groupOptions }) => {
        const filtered = filterOptions(groupOptions)
        if (filtered.length > 0) {
          filteredGroups[groupName] = filtered
          hasResults = true
        }
      })

      if (!hasResults) {
        return <NoResults>找不到符合的選項</NoResults>
      }

      // Render groups and their options
      return Object.entries(filteredGroups).map(([groupName, groupOptions]) => (
        <div key={groupName}>
          <OptionItemGroupName text={groupName} />
          {groupOptions.map((option) => (
            <OptionItem
              key={option.value.toString()}
              onClick={() => handleSelect(option)}
              $selected={isSelected(option.value)}
              $isIndent={true}
            >
              {option.prefixIcon && (
                <OptionItemPrefixIcon>{option.prefixIcon}</OptionItemPrefixIcon>
              )}
              <OptionItemLabel
                text={option.label}
                weight={
                  isSelected(option.value) ? P1.Weight.BOLD : P1.Weight.NORMAL
                }
              />
              {isMultiple && isSelected(option.value) && (
                <CheckMark>
                  <CheckIcon />
                </CheckMark>
              )}
            </OptionItem>
          ))}
        </div>
      ))
    }

    // Handle flat options list
    const filteredOptions = filterOptions(options as Option[])

    if (filteredOptions.length === 0) {
      return <NoResults>找不到符合的選項</NoResults>
    }

    return filteredOptions.map((option) => (
      <OptionItem
        key={option.value.toString()}
        onClick={() => handleSelect(option)}
        $selected={isSelected(option.value)}
      >
        {option.prefixIcon && (
          <OptionItemPrefixIcon>{option.prefixIcon}</OptionItemPrefixIcon>
        )}
        <OptionItemLabel
          text={option.label}
          weight={isSelected(option.value) ? P1.Weight.BOLD : P1.Weight.NORMAL}
        />
        {isMultiple && isSelected(option.value) && (
          <CheckMark>
            <CheckIcon />
          </CheckMark>
        )}
      </OptionItem>
    ))
  }, [isSelected, options, filterOptions, handleSelect, isMultiple])

  return (
    <DropdownMenuContainer ref={dropdownRef} $showAbove={showAbove}>
      {renderedOptions}
    </DropdownMenuContainer>
  )
}
