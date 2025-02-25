'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { MultipleSelectProps, Option, ValueType } from './types'
import { useOutsideClick } from './hooks'
import { DropdownMenu } from './dropdown-menu'
import { isOptionGroup } from './utils'
import {
  SelectContainer,
  SelectBox,
  SelectBoxContent,
  SearchText,
  SearchInput,
  Placeholder,
  ArrowIcon,
  LoadingIndicator,
  TagContainer,
  Tag,
  TagLabel,
  TagCloseIcon,
} from './styles'
// lodash
import { throttle } from 'lodash'

const _ = {
  throttle,
}

export const MultipleSelect = React.memo(function MultipleSelect({
  placeholder = '請選擇',
  options,
  value = [] as ValueType[],
  disabled = false,
  maxDisplay = 'responsive',
  loading = false,
  searchable = false,
  searchPlaceholder = '搜尋...',
  onChange,
}: MultipleSelectProps) {
  // State management
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [visibleTagCount, setVisibleTagCount] = useState(
    typeof maxDisplay === 'number' ? maxDisplay : 1
  )

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null)
  const selectContainerRef = useRef<HTMLDivElement>(null)
  const selectBoxContentRef = useRef<HTMLDivElement>(null)
  const tagRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Get all available options (flattened if grouped)
  const getAllOptions = useMemo((): Option[] => {
    if (isOptionGroup(options)) {
      return options.flatMap((group) => group.options)
    }
    return options as Option[]
  }, [options])

  // Update selected options when value changes
  useEffect(() => {
    const allOptions = getAllOptions
    const selected = allOptions.filter((option) => value.includes(option.value))
    setSelectedOptions(selected)
  }, [value, getAllOptions])

  // Calculate visible tags based on container width when maxDisplay is 'responsive'
  useEffect(() => {
    if (
      maxDisplay !== 'responsive' ||
      !selectBoxContentRef.current ||
      selectedOptions.length === 0
    ) {
      return
    }

    const currentSelectBoxContent = selectBoxContentRef.current

    const calculateVisibleTags = _.throttle(() => {
      if (!currentSelectBoxContent) return

      const availableWidth = currentSelectBoxContent.clientWidth

      // Calculate how many tags can fit
      let totalWidth = 0
      let count = 0

      // Add width of each tag
      for (let i = 0; i < selectedOptions.length; i++) {
        const option = selectedOptions[i]
        const tagElement = tagRefs.current.get(option.value.toString())
        let tagWidth = 0

        if (tagElement) {
          tagWidth = tagElement.offsetWidth + 8 // 8px for margin
        } else {
          tagWidth = 108 // Default estimated width if tag not yet rendered
        }

        // "+N..." tag width approx 50px
        if (totalWidth + tagWidth < availableWidth - 50) {
          totalWidth += tagWidth
          count++
        } else {
          break
        }
      }

      setVisibleTagCount(Math.max(1, count))
    }, 100)

    const resizeObserver = new ResizeObserver(calculateVisibleTags)
    resizeObserver.observe(currentSelectBoxContent)

    calculateVisibleTags()

    return () => {
      resizeObserver.unobserve(currentSelectBoxContent)
      resizeObserver.disconnect()
    }
  }, [selectedOptions, maxDisplay])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [open, searchable])

  // Handle outside clicks
  useOutsideClick(selectContainerRef, () => {
    setOpen(false)
  })

  // Calculate displayed tags and hidden count
  const { displayedTags, hiddenCount } = useMemo(() => {
    // If maxDisplay is 'responsive', use calculated visibleTagCount
    const displayLimit =
      maxDisplay === 'responsive'
        ? visibleTagCount
        : typeof maxDisplay === 'number'
        ? maxDisplay
        : 2

    const displayed = selectedOptions.slice(0, displayLimit)
    const hidden = Math.max(0, selectedOptions.length - displayLimit)
    return { displayedTags: displayed, hiddenCount: hidden }
  }, [selectedOptions, maxDisplay, visibleTagCount])

  // Save tag refs for measurement
  const setTagRef = useCallback(
    (element: HTMLDivElement | null, value: string) => {
      if (element) {
        tagRefs.current.set(value, element)
      } else {
        tagRefs.current.delete(value)
      }
    },
    []
  )

  // Handlers
  const handleToggle = useCallback(() => {
    if (!disabled && !isSearchFocused) {
      setOpen((prevOpen) => {
        if (!prevOpen) {
          setSearchTerm('')
        }
        return !prevOpen
      })
    }
  }, [disabled, isSearchFocused])

  const handleSelect = useCallback(
    (option: Option) => {
      const isSelected = value.includes(option.value)
      let newValue: ValueType[]

      if (isSelected) {
        newValue = value.filter((v) => v !== option.value)
      } else {
        newValue = [...value, option.value]
      }

      onChange(newValue)
    },
    [value, onChange]
  )

  const handleRemoveTag = useCallback(
    (optionValue: ValueType, e: React.MouseEvent) => {
      e.stopPropagation()
      const newValue = value.filter((v) => v !== optionValue)
      onChange(newValue)
    },
    [value, onChange]
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
    <SelectContainer ref={selectContainerRef}>
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
            <SelectBoxContent ref={selectBoxContentRef} $disabled={disabled}>
              {searchable ? (
                selectedOptions.length > 0 ? (
                  <>
                    <TagContainer>
                      {displayedTags.map((option) => (
                        <Tag
                          key={option.value.toString()}
                          ref={(el) => setTagRef(el, option.value.toString())}
                        >
                          <TagLabel text={option.label} />
                          <TagCloseIcon
                            onClick={(e: React.MouseEvent) =>
                              handleRemoveTag(option.value, e)
                            }
                          />
                        </Tag>
                      ))}
                      {hiddenCount > 0 && (
                        <Tag>
                          <TagLabel text={`+${hiddenCount}...`} />
                        </Tag>
                      )}
                    </TagContainer>
                    <SearchText>
                      <SearchInput
                        ref={searchInputRef}
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onClick={handleSearchClick}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                      />
                    </SearchText>
                  </>
                ) : (
                  <SearchText>
                    <SearchInput
                      ref={searchInputRef}
                      type="text"
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onClick={handleSearchClick}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                  </SearchText>
                )
              ) : selectedOptions.length > 0 ? (
                <TagContainer>
                  {displayedTags.map((option) => (
                    <Tag
                      key={option.value.toString()}
                      ref={(el) => setTagRef(el, option.value.toString())}
                    >
                      <TagLabel text={option.label} />
                      <TagCloseIcon
                        onClick={(e: React.MouseEvent) =>
                          handleRemoveTag(option.value, e)
                        }
                      />
                    </Tag>
                  ))}
                  {hiddenCount > 0 && (
                    <Tag>
                      <TagLabel text={`+${hiddenCount}...`} />
                    </Tag>
                  )}
                </TagContainer>
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
          isMultiple={true}
          selectCotainerRef={selectContainerRef}
        />
      )}
    </SelectContainer>
  )
})
