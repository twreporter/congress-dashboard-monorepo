'use client'
import React, { type FC, useState } from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'

const Container = styled.div`
  display: flex;
  padding: 4px;
  align-items: center;
  gap: 4px;
  border-radius: 50px;
  background: ${colorGrayscale.white};
  box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.1);
`

const Button = styled.button<{ $isActive: boolean }>`
  display: flex;
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 40px;
  border: 0;
  background: ${({ $isActive }) =>
    $isActive ? colorGrayscale.gray800 : colorGrayscale.white};
  color: ${({ $isActive }) =>
    $isActive ? colorGrayscale.white : colorGrayscale.gray800};
  cursor: pointer;
`

const BUTTON_CONFIG = [
  {
    text: '全部',
    key: 'all',
  },
  {
    text: '立法院',
    key: 'legislative',
  },
  {
    text: '地方議會',
    key: 'local',
  },
]

export const SectionFilter: FC = () => {
  const [activeKey, setActiveKey] = useState('all')
  return (
    <Container>
      {BUTTON_CONFIG.map(({ text, key }) => (
        <Button
          key={key}
          $isActive={key === activeKey}
          onClick={() => setActiveKey(key)}
        >
          <P1 weight={P1.Weight.BOLD} text={text} />
        </Button>
      ))}
    </Container>
  )
}
