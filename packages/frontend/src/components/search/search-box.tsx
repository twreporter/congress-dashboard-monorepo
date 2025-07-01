import React, { useEffect, useRef, useState, useMemo } from 'react'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import type { LayoutVariant } from '@/components/search/constants'
import { LayoutVariants } from '@/components/search/constants'
import { Search as IconSearch, X as IconX } from '@/components/search/icons'
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { useSearchBox } from 'react-instantsearch'

const _ = {
  debounce,
}

const Input = styled.input`
  width: 100%;
  font-size: 16px;
  line-height: 150%;
  border: 0;
  outline: none;

  color: ${colorGrayscale.gray500};
  background-color: transparent;
`

const Container = styled.div<{ $variant: LayoutVariant; $isFocused: boolean }>`
  width: 100%;
  background-color: ${colorOpacity['white_0.8']};
  border-radius: 40px;
  border: 1px solid ${colorGrayscale.gray400};
  &:hover {
    border: 1px solid ${colorGrayscale.gray600};
  }

  ${({ $variant, $isFocused }) => {
    let variantCss = ''
    switch ($variant) {
      case LayoutVariants.Menu: {
        variantCss = `padding:0 24px; height: 48px; background-color: ${colorOpacity['gray100_0.8']};`
        break
      }
      case LayoutVariants.Modal:
      case LayoutVariants.Header: {
        variantCss = 'padding: 0 20px; height: 40px;'
        break
      }
      case LayoutVariants.Default:
      default: {
        variantCss = 'padding: 0 24px; height: 48px;'
      }
    }
    const focusCss = $isFocused
      ? `
      background-color: ${colorGrayscale.white};
      ${Input} {
        color: ${colorGrayscale.gray800};
      }
    `
      : ''
    return variantCss + focusCss
  }}

  display: flex;
  align-items: center;
  gap: 8px;
`

const ClearButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  line-height: 0;
`

export const SearchBox = ({
  className,
  variant,
  autoFocus,
  onFocus,
}: {
  className?: string
  variant: LayoutVariant
  autoFocus: boolean
  onFocus?: () => void
}) => {
  const defaultPlaceholder = '搜尋立委和議題'
  const inputRef = useRef<HTMLInputElement>(null)
  const { query, refine: _refine, clear } = useSearchBox()
  const [inputValue, setInputValue] = useState(query)
  const [isFocused, setIsFocused] = useState(false)
  const refine = useMemo(() => _.debounce(_refine, 500), [_refine])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    refine(value)
  }

  const clearQuery = () => {
    setInputValue('')
    clear()
  }

  useEffect(() => {
    setInputValue(query)
  }, [query])

  return (
    <Container className={className} $variant={variant} $isFocused={isFocused}>
      <IconSearch />
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleOnChange}
        placeholder={defaultPlaceholder}
        autoFocus={autoFocus}
        onFocus={() => {
          setIsFocused(true)
          onFocus?.()
        }}
        onBlur={() => {
          setIsFocused(false)
        }}
      />
      {inputValue && (
        <ClearButton onClick={clearQuery}>
          <IconX />
        </ClearButton>
      )}
    </Container>
  )
}
