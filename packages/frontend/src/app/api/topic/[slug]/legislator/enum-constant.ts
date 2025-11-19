// type
import { ValuesOf } from '@/types/index'

export const FilterKey = {
  ID: 'id',
  TERM: 'term',
} as const

export type FilterKey = ValuesOf<typeof FilterKey>
