import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

export const Triangle = styled.div<{ $width: string; $height: string }>`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  background: ${colorGrayscale.gray200};
  border-radius: 2px;
`
type CircleProps = {
  width?: number
  height?: number
}
export const Circle: React.FC = ({ width = 56, height = 56 }: CircleProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 56 56"
    fill="none"
  >
    <circle cx="28" cy="28" r="28" fill={colorGrayscale.gray200} />
  </svg>
)
