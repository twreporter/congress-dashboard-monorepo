'use client'

import React from 'react'
import styled, { css } from 'styled-components'
// config
import { selected } from './config'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
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
const Item = styled.a`
  ${textCss}
`

type SelectedProps = {
  className?: string
}

const Selected: React.FC<SelectedProps> = ({ className }: SelectedProps) => {
  if (!selected || selected.length === 0) {
    return null
  }
  return (
    <Container className={className}>
      <Text key="selected-intro">編輯精選：</Text>
      {selected.map(({ label, path }, index) => (
        <SelectedTag key={`selected-${index}`}>
          {index === 0 ? null : <Text>、</Text>}
          <Item href={path}>{label}</Item>
        </SelectedTag>
      ))}
    </Container>
  )
}

export default Selected
