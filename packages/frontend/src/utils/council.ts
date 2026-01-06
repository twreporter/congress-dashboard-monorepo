import { VALID_COUNCILS } from '@/constants/council'

const createChecker =
  <T extends readonly string[]>(values: T) =>
  (value: string): value is T[number] =>
    values.includes(value as T[number])

export const isValidCouncil = createChecker(VALID_COUNCILS)
