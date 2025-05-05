'use client'

import React from 'react'
import styled, { css } from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorBrand,
} from '@twreporter/core/lib/constants/color'
import { TextButton } from '@twreporter/react-components/lib/button'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  flex-wrap: wrap;
`
const textCss = css`
  color: ${colorGrayscale.gray600};
  font-size: 16px;
  font-weight: 700;
  line-height: 150%;
`
const SelectedTag = styled.div`
  display: flex;
`
const Text = styled.div`
  ${textCss}
  cursor: default;
`
const Item = styled(TextButton)`
  &:hover {
    color: ${colorBrand.heavy} !important; //override default color
  }
`

type SelectedProps = {
  selecteds?: {
    label: string
    path: string
    order: number
  }[]
  className?: string
}

const Selected: React.FC<SelectedProps> = ({
  selecteds = [],
  className,
}: SelectedProps) => {
  const openLink = (link: string) => {
    window.open(link, '_self')
  }

  if (!selecteds || selecteds.length === 0) {
    return null
  }
  return (
    <Container className={className}>
      <Text key="selected-intro">編輯精選：</Text>
      {selecteds.map(({ label, path }, index) => (
        <SelectedTag key={`selected-${index}`}>
          {index === 0 ? null : <Text>、</Text>}
          <Item
            text={label}
            theme={TextButton.THEME.normal}
            style={TextButton.Style.LIGHT}
            size={TextButton.Size.L}
            onClick={() => openLink(path)}
          />
        </SelectedTag>
      ))}
    </Container>
  )
}

export default Selected
