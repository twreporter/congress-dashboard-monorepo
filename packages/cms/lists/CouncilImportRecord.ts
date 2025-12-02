// @keystone
import { list } from '@keystone-6/core'
import { text, relationship, integer } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  excludeReadOnlyRoles,
  RoleEnum,
  hideReadOnlyRoles,
  allowRoles,
  hideNotAllowDeleteRoles,
} from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'
import { logger } from '../utils/logger'

const listConfigurations = list({
  fields: {
    recordName: text({
      label: '紀錄名稱',
      validation: { isRequired: true },
    }),
    // TODO: upload data
    importer: relationship({
      ref: 'SystemUser',
      label: '匯入者',
      ui: {
        labelField: 'name',
        createView: { fieldMode: 'hidden' },
      },
    }),
    recordCount: integer({
      label: '筆數',
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    label: '縣市議會資料匯入',
    labelField: 'recordName',
    listView: {
      initialColumns: [
        'recordName',
        // 'uploadData',
        'recordCount',
        'createdAt',
        'updatedAt',
      ],
      initialSort: { field: 'createdAt', direction: 'DESC' },
      pageSize: 50,
    },
    hideDelete: hideNotAllowDeleteRoles,
    itemView: { defaultFieldMode: 'read' },
    hideCreate: hideReadOnlyRoles,
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
    resolveInput: {
      create: ({ resolvedData, context }) => {
        // importer
        const { session } = context
        resolvedData.importer = { connect: { id: Number(session.itemId) } }

        // record count
        // const { csvData } = resolvedData.uploadData
        // if (csvData && csvData.length > 0) {
        //   resolvedData.recordCount = csvData.length - 1 // Exclude header row
        // }

        return resolvedData
      },
    },
    afterOperation: {
      delete: async ({ originalItem, context }) => {
        const { session } = context
        const { data } = session
        const { id } = originalItem
        logger.info(
          `Council Import Record Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'Council Import Record',
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
