import {
  type BaseListTypeInfo,
  type CommonFieldConfig,
  type FieldTypeFunc,
  fieldType,
  type KeystoneContext,
} from '@keystone-6/core/types'
import { graphql } from '@keystone-6/core'

export enum CouncilListName {
  councilor = 'Councilor',
  councilMember = 'CouncilMember',
  councilBill = 'CouncilBill',
  councilTopic = 'CouncilTopic',
  councilTopicRelatedLegislativeTopic = 'CouncilTopicRelatedLegislativeTopic',
  councilTopicRelatedCouncilTopic = 'CouncilTopicRelatedCouncilTopic',
  councilTopicRelatedCityTopic = 'CouncilTopicRelatedCityTopic',
}

export type ListConfig = {
  value: string
  label: string
  expectedHeaders: string[]
  requiredFields: string[]
  nonDuplicateFields: string[]
  charLimitFields?: string[]
  description?: string
}

export const councilListConfigs: Record<CouncilListName, ListConfig> = {
  [CouncilListName.councilor]: {
    value: CouncilListName.councilor,
    label: '縣市議員',
    expectedHeaders: [
      'name',
      'slug',
      'imageLink',
      'externalLink',
      'meetingTermCount',
      'meetingTermCountInfo',
    ],
    requiredFields: ['name', 'slug'],
    nonDuplicateFields: ['slug'],
    description: '匯入縣市議員基本資料',
  },
  [CouncilListName.councilMember]: {
    value: CouncilListName.councilMember,
    label: '議員屆資',
    expectedHeaders: [
      'councilor_name',
      'councilor_slug',
      'party_slug',
      'councilMeeting_term',
      'type',
      'constituency',
      'city',
      'administrativeDistrict',
      'tooltip',
      'note',
      'proposalSuccessCount',
      'relatedLink',
    ],
    requiredFields: [
      'councilor_slug',
      'party_slug',
      'councilMeeting_term',
      'city',
      'type',
    ],
    nonDuplicateFields: ['councilor_slug'],
    description: '匯入議員在各屆議會的資料',
  },
  [CouncilListName.councilBill]: {
    value: CouncilListName.councilBill,
    label: '議案資料',
    expectedHeaders: [
      'slug',
      'councilMeeting_city',
      'councilMeeting_term',
      'councilor_slug',
      'date',
      'title',
      'summary',
      'content',
      'attendee',
      'sourceLink',
    ],
    requiredFields: [
      'slug',
      'councilMeeting_city',
      'councilMeeting_term',
      'councilor_slug',
      'date',
      'title',
    ],
    nonDuplicateFields: ['slug'],
    charLimitFields: ['title', 'attendee'], // prisma string type uses varchar(191)
    description: '匯入議案資料',
  },
  [CouncilListName.councilTopic]: {
    value: CouncilListName.councilTopic,
    label: '縣市議題',
    expectedHeaders: [
      'title',
      'slug',
      'city',
      'type',
      'relatedTwreporterArticle',
      'relatedCouncilBill',
    ],
    requiredFields: ['title', 'slug', 'city', 'type'],
    nonDuplicateFields: ['slug'],
    description: '匯入縣市議題資料',
  },
  [CouncilListName.councilTopicRelatedLegislativeTopic]: {
    value: CouncilListName.councilTopicRelatedLegislativeTopic,
    label: '縣市議題－立法院相關議題關聯',
    expectedHeaders: [
      'councilTopic_title',
      'councilTopic_slug',
      'legislativeTopic_slug',
    ],
    requiredFields: ['councilTopic_slug', 'legislativeTopic_slug'],
    nonDuplicateFields: ['councilTopic_slug', 'legislativeTopic_slug'],
  },
  [CouncilListName.councilTopicRelatedCouncilTopic]: {
    value: CouncilListName.councilTopicRelatedCouncilTopic,
    label: '縣市議題－縣市議會相關議題關聯',
    expectedHeaders: [
      'councilTopic_title',
      'councilTopic_slug',
      'relatedCouncilTopic_slug',
    ],
    requiredFields: ['councilTopic_slug', 'relatedCouncilTopic_slug'],
    nonDuplicateFields: ['councilTopic_slug', 'relatedCouncilTopic_slug'],
  },
  [CouncilListName.councilTopicRelatedCityTopic]: {
    value: CouncilListName.councilTopicRelatedCityTopic,
    label: '縣市議題－同縣市議會相關議題關聯',
    expectedHeaders: [
      'councilTopic_title',
      'councilTopic_slug',
      'relatedCityCouncilTopic_slug',
    ],
    requiredFields: ['councilTopic_slug', 'relatedCityCouncilTopic_slug'],
    nonDuplicateFields: ['councilTopic_slug', 'relatedCityCouncilTopic_slug'],
  },
}

export const getListOptions = () => {
  return Object.values(councilListConfigs).map((config) => ({
    label: config.label,
    value: config.value,
  }))
}

export const councilExpectedHeaders: Record<string, string[]> =
  Object.fromEntries(
    Object.entries(councilListConfigs).map(([key, config]) => [
      key,
      config.expectedHeaders,
    ])
  )

export const councilRequiredFields: Record<string, string[]> =
  Object.fromEntries(
    Object.entries(councilListConfigs).map(([key, config]) => [
      key,
      config.requiredFields,
    ])
  )

export type JSONUploaderFieldConfig<ListTypeInfo extends BaseListTypeInfo> =
  CommonFieldConfig<ListTypeInfo> & {
    storage: string
    validation?: {
      isRequired?: boolean
    }
  }

export const jsonUploader = <ListTypeInfo extends BaseListTypeInfo>(
  config: JSONUploaderFieldConfig<ListTypeInfo>
): FieldTypeFunc<ListTypeInfo> => {
  const storage = config.storage

  return (meta) =>
    fieldType({
      kind: 'multi',
      fields: {
        listName: {
          kind: 'scalar',
          scalar: 'String',
          mode: 'optional',
        },
        filename: {
          kind: 'scalar',
          scalar: 'String',
          mode: 'optional',
        },
        filesize: {
          kind: 'scalar',
          scalar: 'Int',
          mode: 'optional',
        },
        url: {
          kind: 'scalar',
          scalar: 'String',
          mode: 'optional',
        },
      },
    })({
      ...config,
      hooks: {},
      input: {
        create: {
          arg: graphql.arg({ type: graphql.JSON }),
          async resolve(value: any, context: KeystoneContext) {
            if (!value) {
              return {
                listName: null,
                filename: null,
                filesize: null,
                url: null,
              }
            }

            // Handle file upload if fileContent (base64) is provided
            let storedFilename = value.filename || null
            let storedFilesize = value.filesize || null
            let url = null

            if (value.fileContent && value.filename) {
              try {
                // Get the file storage adapter from context
                const filesContext = context.files(storage)

                // Decode base64 content to buffer
                const buffer = Buffer.from(value.fileContent, 'base64')

                // Create a readable stream from the buffer
                const { Readable } = await import('stream')
                const stream = Readable.from(buffer)

                // Upload the file
                const result = await filesContext.getDataFromStream(
                  stream,
                  value.filename
                )

                storedFilename = result.filename
                storedFilesize = result.filesize

                // Get the URL for the uploaded file
                url = await filesContext.getUrl(result.filename)
              } catch (error) {
                console.error('Failed to upload file:', error)
                throw new Error(
                  `Failed to upload file: ${
                    error instanceof Error ? error.message : 'Unknown error'
                  }`
                )
              }
            }

            return {
              listName: value.listName || null,
              filename: storedFilename,
              filesize: storedFilesize,
              url,
            }
          },
        },
        update: {
          arg: graphql.arg({ type: graphql.JSON }),
          async resolve(value: any, context: KeystoneContext, item: any) {
            if (!value) {
              return {
                listName: null,
                filename: null,
                filesize: null,
                url: null,
              }
            }

            // Handle file upload if fileContent (base64) is provided
            let storedFilename = value.filename || null
            let storedFilesize = value.filesize || null
            let url = value.url || null

            if (value.fileContent && value.filename) {
              try {
                const filesContext = context.files(storage)

                // Delete old file if it exists
                const oldFilename = item?.[`${meta.fieldKey}_filename`]
                if (oldFilename) {
                  try {
                    await filesContext.deleteAtSource(oldFilename)
                  } catch (_e) {
                    // Ignore errors when deleting old file
                  }
                }

                // Decode base64 content to buffer
                const buffer = Buffer.from(value.fileContent, 'base64')

                // Create a readable stream from the buffer
                const { Readable } = await import('stream')
                const stream = Readable.from(buffer)

                // Upload the file
                const result = await filesContext.getDataFromStream(
                  stream,
                  value.filename
                )

                storedFilename = result.filename
                storedFilesize = result.filesize

                // Get the URL for the uploaded file
                url = await filesContext.getUrl(result.filename)
              } catch (error) {
                console.error('Failed to upload file:', error)
                throw new Error(
                  `Failed to upload file: ${
                    error instanceof Error ? error.message : 'Unknown error'
                  }`
                )
              }
            }

            return {
              listName: value.listName || null,
              filename: storedFilename,
              filesize: storedFilesize,
              url,
            }
          },
        },
      },
      output: graphql.field({
        type: graphql.JSON,
        async resolve({ value }, _args, context) {
          if (!value.filename) {
            return value
          }

          // Get fresh URL from storage
          try {
            const filesContext = context.files(storage)
            const url = await filesContext.getUrl(value.filename)
            return {
              ...value,
              url,
            }
          } catch (_e) {
            return value
          }
        },
      }),
      views: './lists/views/json-uploader',
      getAdminMeta() {
        return {
          listConfigs: Object.fromEntries(
            Object.entries(councilListConfigs).map(([key, listConfig]) => [
              key,
              {
                value: listConfig.value,
                label: listConfig.label,
                expectedHeaders: listConfig.expectedHeaders,
                requiredFields: listConfig.requiredFields,
                nonDuplicateFields: listConfig.nonDuplicateFields,
                charLimitFields: listConfig.charLimitFields || [],
                description: listConfig.description || '',
                isRequired: !!config.validation?.isRequired,
              },
            ])
          ),
        }
      },
    })
}
