import { list } from '@keystone-6/core'
import { text, relationship, integer } from '@keystone-6/core/fields'
import {
  SLUG,
  CREATED_AT,
  UPDATED_AT,
  URL_VALIDATION_REGEX,
} from './utils/common-field'
import {
  allowAllRoles,
  excludeReadOnlyRoles,
  withReadOnlyRoleFieldMode,
  hideReadOnlyRoles,
  allowRoles,
  RoleEnum,
  hideNotAllowDeleteRoles,
} from './utils/access-control-list'
import { logger } from '../utils/logger'

const listConfigurations = list({
  fields: {
    name: text({
      label: '姓名',
      validation: {
        isRequired: true,
      },
    }),
    slug: SLUG,
    image: relationship({
      ref: 'Photo',
      label: '委員照片',
    }),
    imageLink: text({
      label: 'ImageLink',
    }),
    externalLink: text({
      label: '外部連結',
    }),
    meetingTermCount: integer({
      label: '立委任期屆數',
    }),
    meetingTermCountInfo: text({
      label: '立委任期屆數說明',
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    label: '立法委員',
    labelField: 'name',
    listView: {
      initialColumns: ['name', 'slug'],
      initialSort: { field: 'name', direction: 'DESC' },
      pageSize: 50,
    },
    itemView: {
      defaultFieldMode: withReadOnlyRoleFieldMode,
    },
    hideCreate: hideReadOnlyRoles,
    hideDelete: hideNotAllowDeleteRoles,
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: excludeReadOnlyRoles(),
      update: excludeReadOnlyRoles(),
      delete: allowRoles([RoleEnum.Owner]),
    },
  },
  hooks: {
    validate: {
      create: ({ resolvedData, addValidationError }) => {
        const { imageLink, externalLink } = resolvedData
        if (imageLink && !URL_VALIDATION_REGEX.test(imageLink)) {
          addValidationError('請輸入正確的圖片連結格式')
        }
        if (externalLink && !URL_VALIDATION_REGEX.test(externalLink)) {
          addValidationError('請輸入正確的外部連結格式')
        }
      },
      update: ({ resolvedData, addValidationError }) => {
        const { imageLink, externalLink } = resolvedData
        if (imageLink && !URL_VALIDATION_REGEX.test(imageLink)) {
          addValidationError('請輸入正確的圖片連結格式')
        }
        if (externalLink && !URL_VALIDATION_REGEX.test(externalLink)) {
          addValidationError('請輸入正確的外部連結格式')
        }
      },
    },
    afterOperation: {
      delete: async ({ originalItem, context }) => {
        const { session } = context
        const { data } = session
        const { id } = originalItem
        logger.info(
          `Legislator Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'Legislator',
              itemId: id,
              userEmail: data.email,
              userName: data.name,
            },
          }
        )
      },
    },
  },
})

export default listConfigurations
