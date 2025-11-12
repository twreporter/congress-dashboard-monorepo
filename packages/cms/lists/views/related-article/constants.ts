type ValuesOf<T> = T[keyof T]

export const RELATED_TYPE = {
  wwwArticle: 'www-article',
  wwwTopic: 'www-topic',
} as const

export const RELATED_TYPE_LABEL = {
  [RELATED_TYPE.wwwArticle]: '文章',
  [RELATED_TYPE.wwwTopic]: '專題',
} as const

export const RELATED_TYPE_OPTION = [
  {
    label: RELATED_TYPE_LABEL[RELATED_TYPE.wwwArticle],
    value: RELATED_TYPE.wwwArticle,
  },
  {
    label: RELATED_TYPE_LABEL[RELATED_TYPE.wwwTopic],
    value: RELATED_TYPE.wwwTopic,
  },
] as const

export type RelatedType = ValuesOf<typeof RELATED_TYPE>
