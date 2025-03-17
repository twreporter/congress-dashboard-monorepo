'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const ButtonContainer = styled.div<{ $disabled?: boolean }>`
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 50%;
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
  icon: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}
const TabBarButton: React.FC<TabBarButtonProps> = ({
  icon,
  disabled,
  onClick,
}) => {
  return (
    <ButtonContainer $disabled={disabled} onClick={onClick}>
      {icon}
    </ButtonContainer>
  )
}
export default TabBarButton
