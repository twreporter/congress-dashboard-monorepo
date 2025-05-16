import React, { FC, ChangeEvent, FocusEvent } from 'react'
import styled from 'styled-components'
// type
import type { RadioButtonProps } from '@/components/feedback/radio-button'
// style
import { inputCss } from '@/components/feedback/style'
// @twreporter
import { P1, P2, P3 } from '@twreporter/react-components/lib/text/paragraph'
import {
  colorGrayscale,
  colorBrand,
  COLOR_SEMANTIC,
} from '@twreporter/core/lib/constants/color'
import RadioButton from '@/components/feedback/radio-button'
import mq from '@twreporter/core/lib/utils/media-query'

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
const TextLength = styled(P2)<{ $invalid: boolean }>`
  color: ${(props) =>
    props.$invalid ? colorBrand.heavy : colorGrayscale.gray500};
`
const ErrorMsg = styled(P3)`
  color: ${COLOR_SEMANTIC.danger};
`
const InputText = styled.input<{
  $isError: boolean
  disabled?: boolean
}>`
  ${inputCss}
  padding: 8px 12px;
`
const InputTextarea = styled.textarea<{
  $isError?: boolean
  disabled?: boolean
}>`
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
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

type OptionProps = {
  label: string
  required?: boolean
  error?: string
}

type TextOptionProps = InputProps & OptionProps
export const TextOption: FC<TextOptionProps> = ({
  label,
  required = false,
  type = 'text',
  error,
  ...inputProps
}) => {
  return (
    <OptionBox>
      <Label text={label} weight={P2.Weight.BOLD} $isRequired={required} />
      <InputText type={type} $isError={!!error} {...inputProps} />
      {error ? <ErrorMsg text={error} /> : null}
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
  const reachCharLimit = inputProps.value.length === maxLength
  const textLengthString = `${reachCharLimit ? '已達字數上限 ' : ''}${
    inputProps.value.length
  }/${maxLength}`
  return (
    <OptionBox>
      <TitleBox>
        <Label text={label} weight={P2.Weight.BOLD} $isRequired={required} />
        <TextLength text={textLengthString} $invalid={reachCharLimit} />
      </TitleBox>
      <InputTextarea maxLength={maxLength} {...inputProps} />
    </OptionBox>
  )
}

// radio group component
const RadioBox = styled.div<{ $column: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$column}, 1fr);
  column-gap: 24px;

  ${mq.mobileOnly`
    grid-template-columns: repeat(1, 1fr);
  `}
`
const RadioLabel = styled(P1)`
  color: ${colorGrayscale.gray800};
  flex: none;
`
const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 32px;
`
const RadioInput = styled.input`
  ${inputCss}
  padding: 4px 8px;
  max-width: 100%;
  height: 32px;
  width: 128px;
`

type RadioWithLabelProps = RadioButtonProps & {
  label: string
  showInputOnChecked?: boolean
  onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void
}
const RadioWithLabel: FC<RadioWithLabelProps> = ({
  label,
  showInputOnChecked = false,
  onInputChange,
  ...radioProps
}) => {
  return (
    <RadioOption>
      <RadioButton {...radioProps} />
      <RadioLabel text={label} />
      {showInputOnChecked && radioProps.checked ? (
        <RadioInput onChange={onInputChange} />
      ) : null}
    </RadioOption>
  )
}

type RadioGroupOptionProps = OptionProps & {
  columnNum?: number
  options: RadioWithLabelProps[]
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
        {options.map((optionProps, index) => (
          <RadioWithLabel key={`radio-option-${index}`} {...optionProps} />
        ))}
      </RadioBox>
    </OptionBox>
  )
}
