import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import styled from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { P1, P2 } from '@twreporter/react-components/lib/text/paragraph'
import { Arrow, Cross } from '@twreporter/react-components/lib/icon'
// types
import type {
  ValueType,
  Option,
  OptionGroup,
  SingleSelectProps,
  MultipleSelectProps,
} from './type'
// icon
import CheckIcon from './check-icon'

// Common styles
const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`

const SelectBox = styled.div<{ $disabled: boolean; $focused: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid
    ${(props) =>
      props.$disabled
        ? colorGrayscale.gray300
        : props.$focused
        ? colorGrayscale.gray600
        : colorGrayscale.gray300};
  border-radius: 4px;
  background-color: ${(props) =>
    props.$disabled ? colorGrayscale.gray100 : colorGrayscale.white};
  padding: 12px 8px;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  height: 48px;
  box-sizing: border-box;
  gap: 8px;

  &:hover {
    border-color: ${(props) =>
      !props.$disabled && !props.$focused && colorGrayscale.gray600};
  }
`

const SelectBoxContent = styled.div<{ $disabled: boolean }>`
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'all')};
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  gap: 8px;
`

const Placeholder = styled(P1)`
  color: ${colorGrayscale.gray500};
`

const SelectedLabel = styled(P1)`
  color: ${colorGrayscale.gray800};
`

const DropdownMenuContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 264px;
  overflow-y: auto;
  background: ${colorGrayscale.white};
  border-radius: 4px;
  margin-top: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  box-shadow: 0px 2px 16px 0px ${colorOpacity['black_0.2']};
  z-index: 10;
  /* TODO: scroll bar */
`

const OptionItem = styled.div<{ $selected: boolean; $isIndent?: boolean }>`
  width: 100%;
  height: 40px;
  padding: ${(props) => (props.$isIndent ? '8px 12px 8px 20px' : '8px 12px')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => (props.$selected ? '#F0D5BE80' : 'white')};
  gap: 10px;

  &:hover {
    background-color: ${colorGrayscale.gray100};
  }
`

const OptionItemGroupName = styled(P2)`
  padding: 8px 12px;
  color: ${colorGrayscale.gray600};
`

const OptionItemLabel = styled(P1)`
  flex: 1;
  color: ${colorGrayscale.gray800};
`

const OptionItemPrefixIcon = styled.div`
  height: 16px;
  width: 16px;
`

const Tag = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colorOpacity['black_0.05']};
  border-radius: 4px;
  padding: 2px 8px;
  height: 32px;
  gap: 6px;
`

const TagLabel = styled(P2)`
  display: inline-block !important;
  color: ${colorGrayscale.gray800};
  max-width: 70px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const TagCloseIcon = styled(Cross)`
  cursor: pointer;
  height: 16px !important;
  width: 16px !important;
  padding: 4px;
  background-color: ${colorGrayscale.gray500} !important;

  &:hover {
    background-color: ${colorGrayscale.gray800} !important;
  }
`

const CheckMark = styled.div`
  height: 24px;
  width: 24px;
`

const LoadingIndicator = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 48px;

  &:after {
    content: '';
    width: 24px;
    height: 24px;
    border: 2px solid ${colorGrayscale.gray400};
    border-top-color: ${colorGrayscale.gray600};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const ArrowIcon = styled(Arrow)<{ $isDropdownOpen: boolean }>`
  width: 24px;
  height: 24px;
  transition: transform 0.2s;
  transform: ${(props) =>
    props.$isDropdownOpen ? 'rotate(270deg)' : 'rotate(90deg)'};
  background-color: ${colorGrayscale.gray600} !important;
`

const SearchText = styled(P1)`
  flex: 1;
  color: ${colorGrayscale.gray800};
`
const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  width: 100%;

  &::placeholder {
    color: ${colorGrayscale.gray500};
  }
`

const NoResults = styled.div`
  padding: 12px 16px;
  color: #757575;
  text-align: center;
`

const isOptionGroup = (
  options: OptionGroup[] | Option[]
): options is OptionGroup[] => {
  return (
    Array.isArray(options) && options.length > 0 && 'groupName' in options[0]
  )
}

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
  const [selectedOption, setSelectedOption] = useState<Option>()
  const [focused, setFocused] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [open, searchable])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  const renderedOptions = useMemo(() => {
    if (isOptionGroup(options)) {
      const filteredGroups: Record<string, Option[]> = {}
      let hasResults = false

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

      return Object.entries(filteredGroups).map(([groupName, groupOptions]) => (
        <div key={groupName}>
          <OptionItemGroupName text={groupName} />
          {groupOptions.map((option) => (
            <OptionItem
              key={option.value.toString()}
              onClick={() => handleSelect(option)}
              $selected={value === option.value}
              $isIndent={true}
            >
              <OptionItemLabel
                text={option.label}
                weight={
                  value === option.value ? P1.Weight.BOLD : P1.Weight.NORMAL
                }
              />
            </OptionItem>
          ))}
        </div>
      ))
    }

    const filteredOptions = filterOptions(options as Option[])

    if (filteredOptions.length === 0) {
      return <NoResults>找不到符合的選項</NoResults>
    }

    return filteredOptions.map((option) => (
      <OptionItem
        key={option.value.toString()}
        onClick={() => handleSelect(option)}
        $selected={value === option.value}
      >
        {option.prefixIcon ? (
          <OptionItemPrefixIcon>{option.prefixIcon}</OptionItemPrefixIcon>
        ) : null}
        <OptionItemLabel
          text={option.label}
          weight={value === option.value ? P1.Weight.BOLD : P1.Weight.NORMAL}
        />
      </OptionItem>
    ))
  }, [options, value, filterOptions, handleSelect])

  return (
    <SelectContainer ref={dropdownRef}>
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
                <>
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
                </>
              ) : selectedOption ? (
                <SelectedLabel>{selectedOption.label}</SelectedLabel>
              ) : (
                <Placeholder text={placeholder} />
              )}
            </SelectBoxContent>
            <ArrowIcon $isDropdownOpen={open} />
          </>
        )}
      </SelectBox>

      {open && !loading && (
        <DropdownMenuContainer>{renderedOptions}</DropdownMenuContainer>
      )}
    </SelectContainer>
  )
})

export const MultipleSelect = React.memo(function MultipleSelect({
  placeholder = '請選擇',
  options,
  value = [] as ValueType[],
  disabled = false,
  maxDisplay = 2,
  loading = false,
  searchable = true,
  searchPlaceholder = '搜尋...',
  onChange,
}: MultipleSelectProps) {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getAllOptions = useMemo((): Option[] => {
    if (isOptionGroup(options)) {
      return options.flatMap((group) => group.options)
    }
    return options as Option[]
  }, [options])

  useEffect(() => {
    const allOptions = getAllOptions
    const selected = allOptions.filter((option) => value.includes(option.value))
    setSelectedOptions(selected)
  }, [value, getAllOptions])

  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [open, searchable])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  const renderedOptions = useMemo(() => {
    if (isOptionGroup(options)) {
      const filteredGroups: Record<string, Option[]> = {}
      let hasResults = false

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

      return Object.entries(filteredGroups).map(([groupName, groupOptions]) => (
        <div key={groupName}>
          <OptionItemGroupName text={groupName} />
          {groupOptions.map((option) => (
            <OptionItem
              key={option.value.toString()}
              onClick={() => handleSelect(option)}
              $selected={value.includes(option.value)}
              $isIndent={true}
            >
              <OptionItemLabel
                text={option.label}
                weight={
                  value.includes(option.value)
                    ? P1.Weight.BOLD
                    : P1.Weight.NORMAL
                }
              />
              {value.includes(option.value) && (
                <CheckMark>
                  <CheckIcon />
                </CheckMark>
              )}
            </OptionItem>
          ))}
        </div>
      ))
    }

    const filteredOptions = filterOptions(options)

    if (filteredOptions.length === 0) {
      return <NoResults>找不到符合的選項</NoResults>
    }

    return filteredOptions.map((option) => (
      <OptionItem
        key={option.value.toString()}
        onClick={() => handleSelect(option)}
        $selected={value.includes(option.value)}
      >
        {option.prefixIcon ? (
          <OptionItemPrefixIcon>{option.prefixIcon}</OptionItemPrefixIcon>
        ) : null}
        <OptionItemLabel
          text={option.label}
          weight={
            value.includes(option.value) ? P1.Weight.BOLD : P1.Weight.NORMAL
          }
        />
        {value.includes(option.value) && (
          <CheckMark>
            <CheckIcon />
          </CheckMark>
        )}
      </OptionItem>
    ))
  }, [options, value, filterOptions, handleSelect])

  const { displayedTags, hiddenCount } = useMemo(() => {
    const displayed = selectedOptions.slice(0, maxDisplay)
    const hidden = Math.max(0, selectedOptions.length - maxDisplay)
    return { displayedTags: displayed, hiddenCount: hidden }
  }, [selectedOptions, maxDisplay])

  return (
    <SelectContainer ref={dropdownRef}>
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
              {searchable ? (
                selectedOptions.length > 0 ? (
                  <>
                    <TagContainer>
                      {displayedTags.map((option) => (
                        <Tag key={option.value.toString()}>
                          <TagLabel text={option.label} />
                          <TagCloseIcon
                            onClick={(e: React.MouseEvent) =>
                              handleRemoveTag(option.value, e)
                            }
                          ></TagCloseIcon>
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
                  <>
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
                )
              ) : selectedOptions.length > 0 ? (
                <TagContainer>
                  {displayedTags.map((option) => (
                    <Tag key={option.value.toString()}>
                      <TagLabel text={option.label} />
                      <TagCloseIcon
                        onClick={(e: React.MouseEvent) =>
                          handleRemoveTag(option.value, e)
                        }
                      ></TagCloseIcon>
                    </Tag>
                  ))}
                  {hiddenCount > 0 && (
                    <Tag>
                      <TagLabel text={`+${hiddenCount}...`} />
                    </Tag>
                  )}
                </TagContainer>
              ) : (
                <Placeholder>{placeholder}</Placeholder>
              )}
            </SelectBoxContent>
            <ArrowIcon $isDropdownOpen={open} />
          </>
        )}
      </SelectBox>

      {open && <DropdownMenuContainer>{renderedOptions}</DropdownMenuContainer>}
    </SelectContainer>
  )
})
