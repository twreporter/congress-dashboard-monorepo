'use client'

import React from 'react'
import styled from 'styled-components'
// twreporter
import { colorGrayscale, colorOpacity } from '@twreporter/core/lib/constants/color'
import { IconButton } from '@twreporter/react-components/lib/button'
import { Search } from '@twreporter/react-components/lib/icon'
import  mq from '@twreporter/core/lib/utils/media-query'

const Bar = styled.div`
  padding: 8px 20px;
  border: 1px solid ${colorGrayscale.gray400};
  border-radius: 40px;
  display: flex;
  width: 520px;
  height: 32px;
  align-items: center;
  gap: 8px;
  background-color: ${colorOpacity['white_0.8']};
  ${mq.tabletOnly`
    width: 440px;
  `}
  ${mq.mobileOnly`
    width: calc(100% - 48px);
  `}
`
const Input = styled.input`
  background-color: initial;
  flex: 1 0 0;
  line-height: 24px;
  padding: 0 2px;
  &, &:active, &:focus-visible {
    border: none;
    outline: none;
  }
  
  ::placeholder {
    color: ${colorGrayscale.gray500};
  }
`
const SearchButton = styled(IconButton)`
  width: 24px;
  height: 24px;
`

const SearchBar = () => {
  return (
    <Bar>
      <Input type='text' placeholder='搜尋議題或立委' />
      <SearchButton
        type={IconButton.Type.PRIMARY}
        theme={IconButton.THEME.normal}
        iconComponent={<Search />} //todo: add release branch
      />
    </Bar>
  )
}

export default SearchBar