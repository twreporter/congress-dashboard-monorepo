import { MouseEvent, Dispatch, SetStateAction } from 'react'
import { includes, filter, concat } from 'lodash'

export function createToggleFunc<T>(
  items: T[],
  setItems: Dispatch<SetStateAction<T[]>>
): (e: MouseEvent, toggle: T) => void {
  return (e, toggle) => {
    e.preventDefault()
    e.stopPropagation()

    if (includes(items, toggle)) {
      setItems(filter(items, (item) => item !== toggle))
    } else {
      setItems(concat(items, toggle))
    }
  }
}

export function createTypeWithOtherFormatter<T>(
  types: T[],
  otherString: string,
  typeOther: T
): (T | string)[] {
  return types.map((type) => {
    if (type === typeOther) {
      return otherString || typeOther
    }

    return type
  })
}
