export enum FontSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export const FontSizeOffset = Object.freeze({
  [FontSize.SMALL]: 0,
  [FontSize.MEDIUM]: 2,
  [FontSize.LARGE]: 4,
})

export enum Direction {
  PREV = 'prev',
  NEXT = 'next',
}
