import React from 'react'
import styled from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorBrand,
} from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'

const Item = styled.div<{ $selected: boolean }>`
  display: inline-flex;
  padding: 16px 0px;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  line-height: 150%;
  cursor: pointer;

  ${mq.tabletAndBelow`
    font-size: 18px;  
  `}

  ${(props) =>
    props.$selected
      ? `
    color: ${colorGrayscale.gray800};
    border-bottom: 2px solid ${colorGrayscale.gray800};
  `
      : `
    color: ${colorGrayscale.gray400};
    border: none;
    &:hover {
      color: ${colorBrand.heavy};
      border-bottom: 2px solid ${colorBrand.heavy};
    }
  `}
`

type TabProps = {
  text?: string
  selected?: boolean
  className?: string
  onClick?: () => void
}
const Tab: React.FC<TabProps> = ({
  text = '',
  selected = false,
  className,
  onClick,
}: TabProps) => {
  return (
    <Item $selected={selected} className={className} onClick={onClick}>
      {text}
    </Item>
  )
}
export default Tab
