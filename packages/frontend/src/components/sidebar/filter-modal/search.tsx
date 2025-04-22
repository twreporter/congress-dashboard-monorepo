import React, { InputHTMLAttributes, useState } from 'react'
import styled from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import {
  Cross,
  Search as SearchIcon,
} from '@twreporter/react-components/lib/icon'

// global var
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

// clear button component
const IconBox = styled.div`
  display: flex;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: ${colorGrayscale.gray400};
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
    background-color: ${colorGrayscale.white};
  }

  &:hover {
    background-color: ${colorGrayscale.gray600};
  }
`
type ClearIconProps = {
  onClick?: () => void
  className?: string
}
const ClearIcon: React.FC<ClearIconProps> = ({ onClick, className }) => (
  <IconBox onClick={onClick} className={className}>
    <Cross releaseBranch={releaseBranch} />
  </IconBox>
)

const Box = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  padding: 8px 12px;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  background-color: ${colorOpacity['white_0.8']};
  border: 1px solid ${colorGrayscale.gray300};

  &:hover {
    border: 1px solid ${colorGrayscale.gray600};
  }

  &:has(input:active),
  &:has(input:focus-visible) {
    background-color: ${colorGrayscale.white};
    border: 1px solid ${colorGrayscale.gray600};
  }
`
const Input = styled.input`
  color: ${colorGrayscale.gray800};
  font-size: 16px;
  line-height: 150%;
  width: 100%;
  height: 24px;

  &,
  &:active,
  &:focus-visible {
    border: none;
    outline: none;
  }

  &::placeholder {
    color: ${colorGrayscale.gray500};
  }
`
const Magnifier = styled(SearchIcon)`
  background-color: ${colorGrayscale.gray600} !important;
  flex-shrink: 0;
`
const ClearButton = styled(ClearIcon)<{ $show: boolean }>`
  ${(props) => (props.$show ? '' : 'display: none;')}
`

type SearchProps = InputHTMLAttributes<HTMLInputElement> & {
  handleFocus?: () => void
  handleChange?: (keyword: string) => void
}
const Search: React.FC<SearchProps> = ({
  handleChange,
  handleFocus,
  ...props
}) => {
  const [keyword, setKeyword] = useState('')
  const reset = () => {
    setKeyword('')
    if (typeof handleChange === 'function') {
      handleChange('')
    }
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const value = e.target.value
    setKeyword(value)
    if (typeof handleChange === 'function') {
      handleChange(value)
    }
  }

  return (
    <Box>
      <Magnifier releaseBranch={releaseBranch} />
      <Input
        type="text"
        {...props}
        value={keyword}
        onChange={onChange}
        onFocus={handleFocus}
      />
      <ClearButton onClick={reset} $show={keyword.length > 0} />
    </Box>
  )
}

export default Search
