'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { Arrow } from '@twreporter/react-components/lib/icon'

const ButtonContainer = styled.div<{
  $disabled?: boolean
  $isLoading?: boolean
}>`
  pointer-events: ${(props) =>
    props.$disabled || props.$isLoading ? 'none' : 'auto'};
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) =>
    props.$disabled || props.$isLoading
      ? colorGrayscale.gray400
      : colorGrayscale.gray600};
  border-radius: 50%;
  border: 1px solid
    ${(props) =>
      props.$disabled || props.$isLoading
        ? colorGrayscale.gray400
        : colorGrayscale.gray600};
  svg {
    width: 24px;
    height: 24px;
    background-color: ${(props) =>
      props.$disabled || props.$isLoading
        ? colorGrayscale.gray400
        : colorGrayscale.gray600};
  }
  &:hover {
    color: ${(props) =>
      props.$disabled || props.$isLoading
        ? colorGrayscale.gray400
        : colorGrayscale.gray800};
    border-color: ${(props) =>
      props.$disabled || props.$isLoading
        ? colorGrayscale.gray400
        : colorGrayscale.gray800};
    svg {
      background-color: ${(props) =>
        props.$disabled || props.$isLoading
          ? colorGrayscale.gray400
          : colorGrayscale.gray800};
    }
    cursor: ${(props) =>
      props.$disabled || props.$isLoading ? 'not-allowed' : 'pointer'};
  }
`

const LoadingIndicator = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 24px;

  &:after {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid ${colorGrayscale.gray400};
    border-top-color: ${colorGrayscale.gray600};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

type IconButtonProps = {
  direction?: Arrow.Direction
  disabled?: boolean
  isLoading?: boolean
  onClick?: () => void
}
type IconButtonComponent = React.FC<IconButtonProps> & {
  Direction: typeof Arrow.Direction
}
const IconButton: IconButtonComponent = ({
  direction = Arrow.Direction.LEFT,
  disabled = false,
  isLoading = false,
  onClick = () => {},
}) => {
  return (
    <ButtonContainer
      $disabled={disabled}
      $isLoading={isLoading}
      onClick={onClick}
    >
      {isLoading ? <LoadingIndicator /> : <Arrow direction={direction} />}
    </ButtonContainer>
  )
}

IconButton.Direction = Arrow.Direction

export default IconButton
