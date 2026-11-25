'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const ButtonContainer = styled.button<{ $disabled?: boolean }>`
  width: 40px;
  height: 40px;
  padding: 8px;
  border: 0;
  border-radius: 50%;
  &:focus-visible {
    outline: 2px solid ${colorGrayscale.gray800};
    outline-offset: 3px;
  }
  background-color: ${colorGrayscale.white};
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};
  svg {
    background-color: ${(props) =>
      props.$disabled
        ? colorGrayscale.gray400
        : colorGrayscale.gray600} !important;
  }
`

type TabBarButtonProps = {
  'aria-label': string
  icon: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}
const TabBarButton: React.FC<TabBarButtonProps> = ({
  'aria-label': ariaLabel,
  icon,
  disabled,
  onClick,
}) => {
  return (
    <ButtonContainer
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      $disabled={disabled}
      onClick={onClick}
    >
      {icon}
    </ButtonContainer>
  )
}
export default TabBarButton
