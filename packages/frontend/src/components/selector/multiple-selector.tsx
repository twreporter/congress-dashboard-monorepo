'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
// @twreporter
import useOutsideClick from '@twreporter/react-components/lib/hook/use-outside-click'
import type { MultipleSelectProps, Option, ValueType } from './types'
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
import { throttle, isEqual } from 'lodash'

const _ = {
  throttle,
  isEqual,
}

export const MultipleSelect = React.memo(function MultipleSelect({
  placeholder = '請選擇',
  options,
  defaultValue = [] as ValueType[],
  value = [] as ValueType[],
  disabled = false,
  maxDisplay = 'responsive',
  loading = false,
  searchable = false,
  searchPlaceholder = '搜尋...',
  enableAllOptionLogic = true, // 新增：控制是否啟用全部選項邏輯
  onChange,
}: MultipleSelectProps) {
  // State management
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [visibleTagCount, setVisibleTagCount] = useState(
    typeof maxDisplay === 'number' ? maxDisplay : 3
  )

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null)
  const selectBoxContentRef = useRef<HTMLDivElement>(null)
  const tagRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const selectContainerRef = useOutsideClick(() => {
    setOpen(false)
  })

  // Get all available options (flattened if grouped)
  const getAllOptions = useMemo((): Option[] => {
    if (isOptionGroup(options)) {
      return options.flatMap((group) => group.options)
    }
    return options as Option[]
  }, [options])

  const shouldEnableAllOptionLogic = useMemo(() => {
    if (!enableAllOptionLogic) return false
    const hasAllDefaultValue = defaultValue.includes('all')
    const hasAllOption = getAllOptions.some((option) => option.value === 'all')
    return hasAllDefaultValue && hasAllOption
  }, [enableAllOptionLogic, defaultValue, getAllOptions])

  const allOption = useMemo(() => {
    return getAllOptions.find((option) => option.value === 'all')
  }, [getAllOptions])

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

  // 初始值設置：如果預設值是 ['all'] 且沒有選中任何選項，則自動選中 'all'
  useEffect(() => {
    if (
      shouldEnableAllOptionLogic &&
      _.isEqual(defaultValue, ['all']) &&
      (value.length === 0 ||
        (value.length === 1 &&
          value[0] === 'all' &&
          selectedOptions.length === 0))
    ) {
      // 確保已找到 'all' 選項
      if (allOption) {
        // 設置選中狀態
        onChange(['all'])
      }
    }
  }, [shouldEnableAllOptionLogic, defaultValue, value, selectedOptions, allOption, onChange])

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

      if (shouldEnableAllOptionLogic) {
        const nonAllOptions = getAllOptions.filter((opt) => opt.value !== 'all')
        const nonAllValues = nonAllOptions.map((opt) => opt.value)
        if (option.value === 'all') {
          // 處理選擇「全部」的情況
          if (isSelected) {
            // 如果「全部」已經被選中且僅有這一個選項，不允許取消（至少要有一個選項）
            if (value.length === 1) {
              return
            }
            // 否則，取消「全部」，保留其他選擇
            newValue = value.filter((v) => v !== 'all')
          } else {
            // 如果選擇「全部」，則只保留「全部」，取消其他所有選擇
            newValue = ['all']
          }
        } else {
          // 處理選擇非「全部」選項的情況
          if (isSelected) {
            // 取消選擇該選項
            newValue = value.filter((v) => v !== option.value)
            // 如果取消後沒有任何選項，則自動選擇「全部」
            if (newValue.length === 0) {
              newValue = ['all']
            }
            // 檢查是否選擇了所有非「全部」選項
            const allNonAllSelected = nonAllValues.every(
              (v) => newValue.includes(v) || v === option.value
            )
            // 如果剩下的選擇加上剛剛取消的，等同於所有非全部選項，則切換為「全部」
            if (allNonAllSelected && value.length === nonAllValues.length) {
              newValue = ['all']
            }
          } else {
            // 新增選擇
            if (value.includes('all')) {
              // 如果目前是「全部」，則移除「全部」，只添加當前選項
              newValue = [option.value]
            } else {
              // 否則添加到現有選擇
              newValue = [...value, option.value]
              // 檢查是否選擇了所有非「全部」選項
              const allNonAllSelected = nonAllValues.every((v) =>
                newValue.includes(v)
              )
              // 如果所有非「全部」的選項都被選中，則自動切換為「全部」
              if (
                allNonAllSelected &&
                nonAllValues.length === newValue.length
              ) {
                newValue = ['all']
              }
            }
          }
        }
      } else {
        // 一般選項的處理邏輯
        if (isSelected) {
          newValue = value.filter((v) => v !== option.value)
        } else {
          newValue = [...value, option.value]
        }
      }

      onChange(newValue)
    },
    [value, onChange, getAllOptions, shouldEnableAllOptionLogic]
  )

  const handleRemoveTag = useCallback(
    (optionValue: ValueType, e: React.MouseEvent) => {
      e.stopPropagation()
      // 特殊處理「全部」選項
      if (
        shouldEnableAllOptionLogic &&
        optionValue === 'all' &&
        value.length === 1
      ) {
        // 如果只剩「全部」選項，不允許移除（至少要保留一個選項）
        return
      }

      let newValue = value.filter((v) => v !== optionValue)
      // 如果移除後沒有選項，且有啟用全部選項邏輯，則選中「全部」
      if (newValue.length === 0 && shouldEnableAllOptionLogic) {
        newValue = ['all']
      }
      onChange(newValue)
    },
    [value, onChange, shouldEnableAllOptionLogic]
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
                          {option.isDeletable !== false ? (
                            <TagCloseIcon
                              onClick={(e: React.MouseEvent) =>
                                handleRemoveTag(option.value, e)
                              }
                            />
                          ) : null}
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
                      {option.isDeletable !== false ? (
                        <TagCloseIcon
                          onClick={(e: React.MouseEvent) =>
                            handleRemoveTag(option.value, e)
                          }
                        />
                      ) : null}
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
