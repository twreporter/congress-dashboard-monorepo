import {
  text,
  timestamp,
} from '@keystone-6/core/fields'

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

export const CREATED_AT = timestamp({
  defaultValue: { kind: 'now' },
  ui: {
    createView: { fieldMode: 'hidden' },
    itemView: { fieldMode: 'read' },
  },
})

export const UPDATED_AT = timestamp({
  db: {
    updatedAt: true,
  },
  ui: {
    createView: { fieldMode: 'hidden' },
    itemView: { fieldMode: 'read' },
  },
})