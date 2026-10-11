export const TAB_CONFIG = [
  {
    text: '全部',
    key: 'all',
  },
  {
    text: '人物 ✕ 議題',
    key: 'following-combo',
  },
  {
    text: '議題',
    key: 'following-topic',
  },
  {
    text: '立委/議員',
    key: 'following-people',
  },
  {
    text: '發言全文',
    key: 'following-speech',
  },
  {
    text: '議案',
    key: 'following-bill',
  },
]

export const DEFAULT_FOLLOWING_TAB = 'all'

export const FOLLOWING_TAB_KEYS = TAB_CONFIG.map(({ key }) => key).filter(
  (key) => key !== DEFAULT_FOLLOWING_TAB
)

export const getFollowingTabPath = (key: string) =>
  key === DEFAULT_FOLLOWING_TAB ? '/following' : `/following/${key}`
