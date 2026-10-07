import type { BillMeta } from '@/types/council-bill'

export type CouncilWorkMeta = BillMeta & {
  type: 'speech' | 'bill'
}

export type CouncilWorkData = {
  work: CouncilWorkMeta[]
  speechCount: number
  billCount: number
}
