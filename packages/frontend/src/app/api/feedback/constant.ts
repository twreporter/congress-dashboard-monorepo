// type
import { ValuesOf } from '@/types/index'

export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const

export type HttpStatus = ValuesOf<typeof HttpStatus>
