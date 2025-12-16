// types
import type { BillMeta } from '@/types/council-bill'

export type CouncilTopicOfBillData = {
  slug: string
  title: string
  billCount: number
  bill: BillMeta[]
}

export type CouncilTopicForFilter = {
  slug: string
  title: string
  count: number
}
