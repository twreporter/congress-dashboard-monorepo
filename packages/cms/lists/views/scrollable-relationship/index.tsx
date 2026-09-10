/** @jsxRuntime classic */
/** @jsx jsx */
import styled from '@emotion/styled'
import { jsx } from '@keystone-ui/core'
import type { ComponentProps } from 'react'
import {
  Field as KeystoneRelationshipField,
  CardValue,
  Cell,
  controller,
} from '@keystone-6/core/fields/types/relationship/views'

export { CardValue, Cell, controller }

const FieldContainer = styled.div`
  /*
   * Keystone does not currently expose RelationshipSelect's styles prop.
   * Scope this selector to opted-in fields and anchor it to the relationship
   * field's DOM structure (fieldset > div) instead of generated Emotion class names.
   */
  fieldset > div {
    max-height: 200px;
    overflow-y: auto !important;
  }
`

export function Field(props: ComponentProps<typeof KeystoneRelationshipField>) {
  return (
    <FieldContainer>
      <KeystoneRelationshipField {...props} />
    </FieldContainer>
  )
}
