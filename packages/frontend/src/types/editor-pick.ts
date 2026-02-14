import type { EditorSelectType } from '@/constants/editor-pick'

export type EditorSelect = {
  label: string
  order: number
  slug: string
  type: EditorSelectType
}