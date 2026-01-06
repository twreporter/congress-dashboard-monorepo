import { ValuesOf, createOptions } from '../utils'

export const MEMBER_TYPE = {
  constituency: 'constituency',
  highlandAboriginal: 'highland-aboriginal',
  lowlandAboriginal: 'lowland-aboriginal',
} as const

export type MemberType = ValuesOf<typeof MEMBER_TYPE>

export const MEMBER_TYPE_LABEL: Readonly<Record<MemberType, string>> = {
  [MEMBER_TYPE.constituency]: '區域',
  [MEMBER_TYPE.highlandAboriginal]: '山地原住民',
  [MEMBER_TYPE.lowlandAboriginal]: '平地原住民',
}

export const MEMBER_TYPE_OPTIONS = createOptions(MEMBER_TYPE, MEMBER_TYPE_LABEL)

export default {
  MEMBER_TYPE,
  MEMBER_TYPE_LABEL,
  MEMBER_TYPE_OPTIONS,
}
