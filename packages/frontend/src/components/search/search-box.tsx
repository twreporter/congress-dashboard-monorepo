import React, { useRef, useState, useMemo } from 'react'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import { Search as IconSearch, X as IconX } from '@/components/search/icons'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { useSearchBox } from 'react-instantsearch'

const _ = {
  debounce,
}

export const layoutVariants = {
  Default: 'default', // search bar in the body of the page
  Header: 'header', // search bar in the header
} as const

export type LayoutVariant = (typeof layoutVariants)[keyof typeof layoutVariants]

const Container = styled.div<{ $variant: LayoutVariant }>`
  width: 100%;
  background-color: ${colorGrayscale.white};

  ${({ $variant }) => {
    if ($variant === layoutVariants.Header) {
      return `
        padding: 8px 20px;
        height: 40px;
      `
    }
    return `
      padding: 12px 20px;
      height: 48px;
    `
  }}

  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;

  border: 1px solid ${colorGrayscale.gray600};
  border-radius: 40px;
`

const Input = styled.input`
  width: 100%;
  font-size: 16px;
  line-height: 150%;
  border: 0;
  outline: none;

  color: ${colorGrayscale.gray800};
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
}: {
  className?: string
  variant: LayoutVariant
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { query, refine: _refine } = useSearchBox()
  const [inputValue, setInputValue] = useState(query)
  const refine = useMemo(() => _.debounce(_refine, 500), [_refine])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    refine(value)
  }

  const clearQuery = () => {
    setInputValue('')
    refine('')
  }

  return (
    <Container className={className} $variant={variant}>
      <IconSearch />
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleOnChange}
        placeholder="搜尋立委和議題"
      />
      {inputValue && (
        <ClearButton onClick={clearQuery}>
          <IconX />
        </ClearButton>
      )}
    </Container>
  )
}
