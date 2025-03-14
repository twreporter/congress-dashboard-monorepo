'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { PillButton } from '@twreporter/react-components/lib/button'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const GrayPillButton = styled(PillButton)<{
  $disabled?: boolean
  $isLoading?: boolean
}>`
  ${(props) =>
    props.$disabled || props.$isLoading
      ? `
    color: ${colorGrayscale.gray400} !important;
    border-color: ${colorGrayscale.gray400} !important;
    background-color: ${colorGrayscale.gray100} !important;
    svg {
      background-color: ${colorGrayscale.gray400} !important;
    }
    cursor: not-allowed !important;
    `
      : `
    color: ${colorGrayscale.gray600} !important;
    border-color: ${colorGrayscale.gray600} !important;
    background-color: ${colorGrayscale.gray100} !important;
    svg {
      background-color: transparent !important;
    }
    &:hover {
      color: ${colorGrayscale.gray800} !important;
      border-color: ${colorGrayscale.gray800} !important;
      background-color: ${colorGrayscale.gray100} !important;
      svg path {
        fill: ${colorGrayscale.gray800} !important;
      }
    } 
    `}
`

export type CustomPillButtonProps = {
  text?: string
  leftIconComponent?: React.ReactNode
  rightIconComponent?: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
}
const CustomPillButton: React.FC<CustomPillButtonProps> = ({
  text = '',
  leftIconComponent = null,
  rightIconComponent = null,
  disabled = false,
  isLoading = false,
}) => {
  return (
    <GrayPillButton
      $disabled={disabled}
      $isLoading={isLoading}
      disabled={disabled}
      loading={isLoading}
      text={text}
      leftIconComponent={leftIconComponent}
      rightIconComponent={rightIconComponent}
      size={PillButton.Size.L}
      type={PillButton.Type.SECONDARY}
      style={PillButton.Style.DARK}
    />
  )
}

export default CustomPillButton
