import {
  text,
  timestamp,
  type TimestampFieldConfig,
} from '@keystone-6/core/fields'
import { type BaseListTypeInfo } from '@keystone-6/core/types'

// ref: https://regex101.com/r/gilHCG/1
export const URL_VALIDATION_REGEX =
  /^(?<scheme>[a-z][a-z0-9+.-]+):(?<authority>\/\/(?<user>[^@]+@)?(?<host>[a-z0-9.-_~]+)(?<port>:\d+)?)?(?<path>(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+(?:\/(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])*)*|(?:\/(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+)*)?(?<query>\?(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@]|[/?])+)?(?<fragment>#(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@]|[/?])+)?$/i

export const SLUG = text({
  validation: {
    isRequired: true,
    match: {
      regex: /^[a-z0-9-]+$/,
      explanation: '請輸入正確格式，僅能使用小寫英文、數字和符號(-)',
    },
  },
  label: 'Slug',
  isIndexed: 'unique',
})

export const CREATED_AT = (opts: TimestampFieldConfig<BaseListTypeInfo> = {}) =>
  timestamp({
    defaultValue: { kind: 'now' },
    ui: {
      createView: { fieldMode: 'hidden' },
      itemView: { fieldMode: 'read' },
    },
    ...opts,
  })

export const UPDATED_AT = (opts: TimestampFieldConfig<BaseListTypeInfo> = {}) =>
  timestamp({
    db: {
      updatedAt: true,
    },
    ui: {
      createView: { fieldMode: 'hidden' },
      itemView: { fieldMode: 'read' },
    },
    ...opts,
  })
