import React, { FC, ChangeEvent } from 'react'
import styled, { css } from 'styled-components'
// type
import type { RadioButtonProps } from '@/components/feedback/radio-button'
// @twreporter
import { P1, P2 } from '@twreporter/react-components/lib/text/paragraph'
import {
  colorGrayscale,
  colorBrand,
} from '@twreporter/core/lib/constants/color'
import RadioButton from '@/components/feedback/radio-button'

const OptionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`
const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
`
const Label = styled(P2)<{ $isRequired: boolean }>`
  color: ${colorGrayscale.gray800};
  ${(props) =>
    props.$isRequired
      ? `
    &:after {
      content: '*';
      color: ${colorBrand.heavy};
      margin-left: 4px;
    }
  `
      : ''}
`
const TextLength = styled(P2)`
  color: ${colorGrayscale.gray500};
`
const inputCss = css`
  font-size: 16px;
  line-height: 150%;

  ::placeholder {
    color: ${colorGrayscale.gray500};
  }
`
const InputText = styled.input`
  ${inputCss}
  padding: 8px 12px;
`
const InputTextarea = styled.textarea`
  ${inputCss}
  padding: 12px;
  height: 144px;
`

type InputProps = {
  value: string
  placeholder?: string
  disabled?: boolean
  type?: 'text' | 'email' | 'number'
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

type OptionProps = {
  label: string
  required?: boolean
}

type TextOptionProps = InputProps & OptionProps
export const TextOption: FC<TextOptionProps> = ({
  label,
  required = false,
  type = 'text',
  ...inputProps
}) => {
  return (
    <OptionBox>
      <Label text={label} weight={P2.Weight.BOLD} $isRequired={required} />
      <InputText type={type} {...inputProps} />
    </OptionBox>
  )
}

// textarea options component
type TextareaOptionProps = InputProps &
  OptionProps & {
    maxLength: number
  }
export const TextareaOption: FC<TextareaOptionProps> = ({
  label,
  required = false,
  maxLength,
  ...inputProps
}) => {
  const textLengthString = `${inputProps.value.length}/${maxLength}`
  return (
    <OptionBox>
      <TitleBox>
        <Label text={label} weight={P2.Weight.BOLD} $isRequired={required} />
        <TextLength text={textLengthString} />
      </TitleBox>
      <InputTextarea maxLength={maxLength} {...inputProps} />
    </OptionBox>
  )
}

// radio group component
const RadioBox = styled.div<{ $column: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$column}, 1fr);
  gap: 8px;
`
const RadioLabel = styled(P1)`
  color: ${colorGrayscale.gray800};
`
const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

type RadioGroupOptionProps = OptionProps & {
  columnNum?: number
  options: (RadioButtonProps & { label: string })[]
}
export const RadioGroupOption: FC<RadioGroupOptionProps> = ({
  label,
  required = false,
  columnNum = 1,
  options,
}) => {
  return (
    <OptionBox>
      <Label text={label} weight={P2.Weight.BOLD} $isRequired={required} />
      <RadioBox $column={columnNum}>
        {options.map(({ label, ...radioProps }, index) => (
          <RadioOption key={`radio-option-${index}`}>
            <RadioButton {...radioProps} />
            <RadioLabel text={label} />
          </RadioOption>
        ))}
      </RadioBox>
    </OptionBox>
  )
}
