import React, { useState, useMemo } from 'react'
import { useSearchBox } from 'react-instantsearch'
import styled from 'styled-components'
import { Search as IconSearch, X as IconX } from '@/components/search/icons'
import debounce from 'lodash/debounce'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const _ = {
  debounce,
}

const Container = styled.div`
  width: 100%;
  background-color: ${colorGrayscale.white};

  margin-bottom: 8px;
  padding: 12px 20px;

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

export const SearchBox = () => {
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
    <Container>
      <IconSearch />
      <Input
        type="text"
        value={inputValue}
        onChange={handleOnChange}
        placeholder="搜尋立委、議題和逐字稿..."
      />
      {inputValue && (
        <ClearButton onClick={clearQuery}>
          <IconX />
        </ClearButton>
      )}
    </Container>
  )
}
