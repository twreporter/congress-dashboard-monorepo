import { RELATED_TYPE } from './constants'

type ValuesOf<T> = T[keyof T]

export type RelatedType = ValuesOf<typeof RELATED_TYPE>

// todo: parse RELATED_TYPE instead of hard code string value when it has more related types
export function isRelatedType(type: string): boolean {
  return type === 'www-article' || type === 'www-topic'
}
