/** @jsxRuntime classic */
/** @jsx jsx */
import styled from '@emotion/styled'
import { jsx } from '@keystone-ui/core'
import {
  FieldContainer,
  FieldLabel,
  FieldDescription,
} from '@keystone-ui/fields'
import { useState } from 'react'

import type {
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from '@keystone-6/core/types'
import type { CardValueComponent, CellComponent } from '@keystone-6/core/types'

const DateInput = styled.input`
  background-color: #fafbfc;
  border-color: #e1e5e9;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  color: #374151;
  font-size: 1rem;
  height: 38px;
  line-height: initial;
  outline: 0;
  padding-bottom: 0;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 0;
  cursor: pointer;
`

const ValidationMessage = styled.div`
  color: red;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;
`

type CalendarDayValue =
  | { kind: 'create'; value: string | null }
  | { kind: 'update'; value: string | null; initial: string | null }

type CalendarDayFieldMeta = {
  isRequired: boolean
}

function validate(
  value: CalendarDayValue,
  fieldMeta: CalendarDayFieldMeta,
  label: string
): string | undefined {
  if (
    value.kind === 'update' &&
    value.initial === null &&
    value.value === null
  ) {
    return undefined
  }
  if (fieldMeta.isRequired && value.value === null) {
    return `${label} is required`
  }
  return undefined
}

function formatOutput(isoDateString: string | null): string | null {
  if (!isoDateString) {
    return null
  }
  const date = new Date(`${isoDateString}T00:00Z`)
  const dateInLocalTimezone = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  )
  return dateInLocalTimezone.toLocaleDateString('zh-TW')
}

export function Field({
  field,
  value,
  onChange,
  forceValidation,
}: FieldProps<typeof controller>) {
  const [touchedInput, setTouchedInput] = useState(false)
  const showValidation = touchedInput || forceValidation
  const validationMessage = showValidation
    ? validate(value, field.fieldMeta, field.label)
    : undefined

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <FieldDescription id={`${field.path}-description`}>
        {field.description}
      </FieldDescription>
      {onChange ? (
        <div>
          <DateInput
            type="date"
            value={value.value ?? ''}
            onChange={(e) => {
              onChange({
                ...value,
                value: e.target.value || null,
              })
            }}
            onBlur={() => setTouchedInput(true)}
          />
          {validationMessage && (
            <ValidationMessage>{validationMessage}</ValidationMessage>
          )}
        </div>
      ) : (
        value.value !== null && <span>{formatOutput(value.value)}</span>
      )}
    </FieldContainer>
  )
}

export const Cell: CellComponent = ({ item, field, linkTo }) => {
  const value = item[field.path] as string | null
  return linkTo ? (
    <a href={linkTo.href}>{formatOutput(value)}</a>
  ) : (
    <span>{formatOutput(value)}</span>
  )
}
Cell.supportsLinkTo = true

export const CardValue: CardValueComponent = ({ item, field }) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {formatOutput(item[field.path] as string | null)}
    </FieldContainer>
  )
}

export function controller(
  config: FieldControllerConfig<CalendarDayFieldMeta>
): FieldController<CalendarDayValue, string> & {
  fieldMeta: CalendarDayFieldMeta
} {
  return {
    path: config.path,
    label: config.label,
    description: config.description ?? '',
    graphqlSelection: config.path,
    fieldMeta: config.fieldMeta,
    defaultValue: {
      kind: 'create',
      value: null,
    },
    deserialize: (data) => {
      const value = data[config.path]
      return {
        kind: 'update',
        initial: value,
        value,
      }
    },
    serialize: ({ value }) => {
      return {
        [config.path]: value,
      }
    },
    validate: (value) =>
      validate(value, config.fieldMeta, config.label) === undefined,
  }
}
