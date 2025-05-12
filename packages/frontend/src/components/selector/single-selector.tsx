'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
// hook
import useOutsideClick from '@/hooks/use-outside-click'
// @twreporter
import type { SingleSelectProps, Option } from './types'
import { DropdownMenu } from './dropdown-menu'
import { isOptionGroup } from './utils'
import {
  SelectContainer,
  SelectBox,
  SelectBoxContent,
  SearchText,
  SearchInput,
  Placeholder,
  SelectedLabel,
  ArrowIcon,
  LoadingIndicator,
} from './styles'

export const SingleSelect = React.memo(function SingleSelect({
  placeholder = '請選擇',
  options,
  value,
  disabled = false,
  loading = false,
  searchable = true,
  searchPlaceholder = '搜尋...',
  onChange,
}: SingleSelectProps) {
  // State management
  const [selectedOption, setSelectedOption] = useState<Option>()
  const [focused, setFocused] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null)
  const selectorContainerRef = useOutsideClick(() => {
    setOpen(false)
  })

  // Find and set the selected option when value changes
  useEffect(() => {
    const findSelectedOption = () => {
      if (value === null) return undefined

      if (isOptionGroup(options)) {
        for (const group of options) {
          const found = group.options.find((opt) => opt.value === value)
          if (found) return found
        }
      } else {
        return options.find((opt) => opt.value === value)
      }
      return undefined
    }

    setSelectedOption(findSelectedOption())
  }, [value, options])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [open, searchable])

  // Handlers
  const handleToggle = useCallback(() => {
    if (!disabled && !loading) {
      setOpen((prevOpen) => {
        if (!prevOpen) {
          setSearchTerm('')
        }
        return !prevOpen
      })
    }
  }, [disabled, loading])

  const handleSelect = useCallback(
    (option: Option) => {
      onChange(option.value)
      setSelectedOption(option)
      setOpen(false)
      setSearchTerm('')
    },
    [onChange]
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
      if (!open) {
        setOpen(true)
      }
    },
    [open]
  )

  const handleSearchClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      e.stopPropagation()
      if (!open) {
        setOpen(true)
      }
    },
    [open]
  )

  const filterOptions = useCallback(
    (optionsToFilter: Option[]) => {
      if (!searchTerm) return optionsToFilter
      return optionsToFilter.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    },
    [searchTerm]
  )

  return (
    <SelectContainer ref={selectorContainerRef}>
      <SelectBox
        onClick={handleToggle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        $disabled={disabled}
        $focused={focused}
      >
        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            <SelectBoxContent $disabled={disabled}>
              {searchable && !selectedOption ? (
                <SearchText>
                  <SearchInput
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClick={handleSearchClick}
                  />
                </SearchText>
              ) : selectedOption ? (
                <SelectedLabel text={selectedOption.label} />
              ) : (
                <Placeholder text={placeholder} />
              )}
            </SelectBoxContent>
            <ArrowIcon $isDropdownOpen={open} />
          </>
        )}
      </SelectBox>

      {open && !loading && (
        <DropdownMenu
          options={options}
          value={value}
          filterOptions={filterOptions}
          handleSelect={handleSelect}
          isMultiple={false}
          selectCotainerRef={selectorContainerRef}
        />
      )}
    </SelectContainer>
  )
})
