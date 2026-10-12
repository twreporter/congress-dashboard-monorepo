export const FOLLOWING_TAB = {
  ALL: 'all',
  COMBO: 'following-combo',
  TOPIC: 'following-topic',
  PEOPLE: 'following-people',
  SPEECH: 'following-speech',
  BILL: 'following-bill',
} as const

export type FollowingTabKey = (typeof FOLLOWING_TAB)[keyof typeof FOLLOWING_TAB]

export const TAB_CONFIG: { text: string; key: FollowingTabKey }[] = [
  {
    text: '全部',
    key: FOLLOWING_TAB.ALL,
  },
  {
    text: '人物 ✕ 議題',
    key: FOLLOWING_TAB.COMBO,
  },
  {
    text: '議題',
    key: FOLLOWING_TAB.TOPIC,
  },
  {
    text: '立委/議員',
    key: FOLLOWING_TAB.PEOPLE,
  },
  {
    text: '發言全文',
    key: FOLLOWING_TAB.SPEECH,
  },
  {
    text: '議案',
    key: FOLLOWING_TAB.BILL,
  },
]

export const DEFAULT_FOLLOWING_TAB = FOLLOWING_TAB.ALL

export const FOLLOWING_TAB_KEYS: FollowingTabKey[] = TAB_CONFIG.map(
  ({ key }) => key
).filter((key) => key !== DEFAULT_FOLLOWING_TAB)

export const isFollowingTabKey = (key: string): key is FollowingTabKey =>
  FOLLOWING_TAB_KEYS.includes(key as FollowingTabKey)

export const getFollowingTabPath = (key: string) =>
  key === DEFAULT_FOLLOWING_TAB ? '/following' : `/following/${key}`
