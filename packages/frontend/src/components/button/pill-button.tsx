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
  height: 40px;
  border-width: 1px !important;
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
    pointer-events: 'none';
    `
      : `
    pointer-events: auto;
    color: ${colorGrayscale.gray600} !important;
    border-color: ${colorGrayscale.gray600} !important;
    background-color: ${colorGrayscale.gray100} !important;
    svg {
      background-color: ${colorGrayscale.gray600} !important;
    }
    &:hover {
      color: ${colorGrayscale.gray800} !important;
      border-color: ${colorGrayscale.gray800} !important;
      background-color: ${colorGrayscale.gray100} !important;
      svg {
        background-color: ${colorGrayscale.gray800} !important;
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
  onClick?: () => void
}
const CustomPillButton: React.FC<CustomPillButtonProps> = ({
  text = '',
  leftIconComponent = null,
  rightIconComponent = null,
  disabled = false,
  isLoading = false,
  onClick = () => {},
}) => {
  return (
    <GrayPillButton
      onClick={onClick}
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
