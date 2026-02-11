import { ValuesOf, createOptions } from '../utils'

export const COUNCIL_TOPIC_TYPE = {
  general: 'general',
  twreporter: 'twreporter',
} as const

export type CouncilTopicType = ValuesOf<typeof COUNCIL_TOPIC_TYPE>

export const COUNCIL_TOPIC_TYPE_LABEL: Readonly<
  Record<CouncilTopicType, string>
> = {
  [COUNCIL_TOPIC_TYPE.general]: '基本議題',
  [COUNCIL_TOPIC_TYPE.twreporter]: '精選議題',
}

export const COUNCIL_TOPIC_TYPE_OPTIONS = createOptions(
  COUNCIL_TOPIC_TYPE,
  COUNCIL_TOPIC_TYPE_LABEL
)

export default {
  COUNCIL_TOPIC_TYPE,
  COUNCIL_TOPIC_TYPE_LABEL,
  COUNCIL_TOPIC_TYPE_OPTIONS,
}
