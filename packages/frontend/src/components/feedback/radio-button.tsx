import React, { ChangeEvent, FC } from 'react'
import styled from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'

const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

const Label = styled.label<{ disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  position: relative;
  color: ${colorGrayscale.gray300};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  svg circle {
    transition: stroke 0.2s ease, fill 0.2s ease;
  }

  &:hover {
    color: ${colorSupportive.heavy};
  }
`

type IconProps = {
  disabled?: boolean
}

const SelectedIcon: FC<IconProps> = ({ disabled = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clip-path="url(#clip0_4096_288580)">
        {disabled ? (
          <circle
            cx="10"
            cy="10"
            r="9.5"
            fill={colorGrayscale.gray100}
            stroke={colorGrayscale.gray300}
          />
        ) : (
          <circle
            cx="10"
            cy="10"
            r="7.5"
            fill={colorGrayscale.white}
            stroke={colorSupportive.heavy}
            stroke-width="5"
          />
        )}
        {disabled ? (
          <circle cx="10" cy="10" r="5" fill={colorGrayscale.gray300} />
        ) : null}
      </g>
      <defs>
        <clipPath id="clip0_4096_288580">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

const UnselectedIcon: FC<IconProps> = ({ disabled = false }) => {
  const fill = disabled ? colorGrayscale.gray100 : colorGrayscale.white
  const stroke = disabled ? colorGrayscale.gray300 : 'currentColor'
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clip-path="url(#clip0_4096_288582)">
        <circle cx="10" cy="10" r="9.5" fill={fill} stroke={stroke} />
      </g>
      <defs>
        <clipPath id="clip0_4096_288582">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export type RadioButtonProps = {
  checked: boolean
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  name?: string
  value?: string
  className?: string
}

const RadioButton: FC<RadioButtonProps> = ({
  checked,
  disabled = false,
  onChange,
  name,
  value,
  className,
}) => (
  <Label disabled={disabled} className={className}>
    <HiddenRadio
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      name={name}
      value={value}
    />
    {checked ? (
      <SelectedIcon disabled={disabled} />
    ) : (
      <UnselectedIcon disabled={disabled} />
    )}
  </Label>
)

export default RadioButton
