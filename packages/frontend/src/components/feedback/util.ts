import { MouseEvent, Dispatch, SetStateAction } from 'react'
import { includes, filter, concat } from 'lodash'
const _ = {
  includes,
  filter,
  concat,
}

export function createToggleFunc<T>(
  items: T[],
  setItems: Dispatch<SetStateAction<T[]>>
): (e: MouseEvent, toggle: T) => void {
  return (e, toggle) => {
    e.preventDefault()
    e.stopPropagation()

    if (_.includes(items, toggle)) {
      setItems(_.filter(items, (item) => item !== toggle))
    } else {
      setItems(_.concat(items, toggle))
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
