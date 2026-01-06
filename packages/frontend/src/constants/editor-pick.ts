import { ValuesOf } from '@/types'

export const EDITOR_SELECT_TYPE = {
  legislator: 'legislator',
  topic: 'topic',
} as const

export type EditorSelectType = ValuesOf<typeof EDITOR_SELECT_TYPE>