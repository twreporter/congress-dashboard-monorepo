import { GraphQLError } from 'graphql'
import { list } from '@keystone-6/core'
import { text, select, json, relationship } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'

enum ListName {
  legislator = 'Legislator',
  topic = 'Topic',
  // TODO: add rest
}

const expectedHeader: Record<string, string> = {
  [ListName.legislator]: 'name,slug,imageLink',
  [ListName.topic]: 'title,slug',
}

const listConfigurations = list({
  fields: {
    recordName: text({
      label: '紀錄名稱',
      validation: {
        isRequired: true,
      },
      ui: {
        itemView: {
          fieldMode: 'edit',
        },
      },
    }),
    listName: select({
      label: '匯入項目',
      validation: {
        isRequired: true,
      },
      options: [
        {
          label: '立法委員',
          value: ListName.legislator,
        },
      ],
    }),
    csvData: json({
      label: 'CSV',
      ui: {
        description: `立法委員標題順序為 ${
          expectedHeader[ListName.legislator]
        }\n議題標題順序為 ${expectedHeader[ListName.topic]}`,
        views: './lists/views/upload-csv-input',
      },
    }),
    importer: relationship({
      ref: 'SystemUser',
      label: '匯入者',
      ui: {
        labelField: 'name',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: '資料匯入',
    labelField: 'recordName',
    listView: {
      initialColumns: ['recordName', 'listName', 'createdAt', 'updatedAt'],
      initialSort: { field: 'createdAt', direction: 'DESC' },
      pageSize: 50,
    },
    hideDelete: true,
    itemView: {
      defaultFieldMode: 'read',
    },
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: allowAllRoles(),
      update: allowAllRoles(),
      delete: allowAllRoles(),
    },
  },
  hooks: {
    resolveInput: {
      create: ({ resolvedData, context }) => {
        const { session } = context
        resolvedData.importer = { connect: { id: session.itemId } }
        return resolvedData
      },
    },
    validate: {
      create: async ({ resolvedData, addValidationError }) => {
        const { csvData, listName }: { csvData?: string; listName?: string } =
          resolvedData
        if (!csvData) {
          return addValidationError('請上傳 CSV 檔案')
        }
        const csvDataArray = JSON.parse(csvData)
        const csvHeader = csvDataArray[0].join()

        // Validate the first line against the expected header
        if (listName && csvHeader !== expectedHeader[listName]) {
          return addValidationError(
            `CSV 檔案標題格式不符\n上傳內容標題: ${csvHeader}\n規格標題應為: ${expectedHeader[listName]}\n請確認標題順序是否正確\n`
          )
        }
      },
    },
    beforeOperation: {
      create: async ({ resolvedData, context }) => {
        const { listName, csvData } = resolvedData
        const csvDataArray = JSON.parse(csvData)
        const csvDataValue = csvDataArray.slice(1)

        const queries: any[] = []
        if (listName === ListName.legislator) {
          csvDataValue.forEach(
            ([name, slug, imageLink]: [
              name: string,
              slug: string,
              imageLink?: string
            ]) => {
              queries.push(
                context.prisma.Legislator.upsert({
                  where: {
                    slug,
                  },
                  update: {
                    name,
                    imageLink,
                  },
                  create: {
                    name,
                    slug,
                    imageLink,
                  },
                })
              )
            }
          )
        }

        if (queries.length) {
          try {
            const result = await context.prisma.$transaction(queries)
            const errors = result.filter(
              (item: any) => item instanceof GraphQLError
            )
            if (errors.length) {
              const errorMessages = errors.map((err: any) => {
                return `${
                  err.extensions?.debug?.message
                    ? `${err.extensions.debug.message}`
                    : ''
                }`.trim()
              })
              throw new Error(
                `Transaction failed with the following errors: \n${errorMessages.join(
                  '\n\n'
                )}`
              )
            }
          } catch (error) {
            throw new Error(`上傳失敗, ${error}`)
          }
        }
      },
    },
  },
})

export default listConfigurations
