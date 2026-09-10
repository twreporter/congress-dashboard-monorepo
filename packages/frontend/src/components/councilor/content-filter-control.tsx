'use client'

import React from 'react'
import styled from 'styled-components'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import type { WorkFilter } from '@/utils/council-work'

const workFilterOptions: [WorkFilter, string][] = [
  ['all', '全部'],
  ['speech', '發言'],
  ['bill', '議案'],
]

const Container = styled.div`
  display: flex;
  align-self: center;
  gap: 4px;
  padding: 4px;
  border-radius: 50px;
  background: ${colorGrayscale.white};
  box-shadow: 0 0 12px ${colorOpacity['black_0.1']};
`

const Item = styled.button<{ $selected: boolean }>`
  appearance: none;
  border: 0;
  border-radius: 40px;
  padding: 4px 16px;
  background: ${(props) =>
    props.$selected ? colorGrayscale.gray800 : colorGrayscale.white};
  color: ${(props) =>
    props.$selected ? colorGrayscale.white : colorGrayscale.gray800};
  cursor: pointer;

  &:hover {
    background: ${(props) =>
      props.$selected ? colorGrayscale.gray800 : colorGrayscale.gray100};
  }
`

const Text = styled(P1)`
  color: inherit;
`

type Props = {
  value: WorkFilter
  onChange: (value: WorkFilter) => void
  className?: string
}

const ContentFilterControl: React.FC<Props> = ({
  value,
  onChange,
  className,
}) => (
  <Container className={className}>
    {workFilterOptions.map(([filter, label]) => (
      <Item
        type="button"
        key={filter}
        $selected={filter === value}
        aria-pressed={filter === value}
        onClick={() => onChange(filter)}
      >
        <Text text={label} weight={P1.Weight.BOLD} />
      </Item>
    ))}
  </Container>
)

export default ContentFilterControl
