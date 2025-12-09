import { GraphQLError } from 'graphql'
// @keystone
import { list } from '@keystone-6/core'
import type { KeystoneContext } from '@keystone-6/core/types'
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
import {
  jsonUploader,
  CouncilListName,
  councilExpectedHeaders,
  councilRequiredFields,
} from './fields/json-uploader'
import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'

/**
 * Validate JSON structure against expected headers and required fields
 */
const validateJsonStructure = (
  jsonData: any[],
  listName: string,
  expectedHeaders: Record<string, string[]>,
  requiredFields: Record<string, string[]>
) => {
  const errors: string[] = []

  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    errors.push('JSON 檔案格式錯誤或資料為空')
    return errors
  }

  const expectedHeadersArray = expectedHeaders[listName]
  if (!expectedHeadersArray) {
    errors.push(`不支援的匯入項目: ${listName}`)
    return errors
  }

  // Validate each object in the JSON array
  for (let i = 0; i < jsonData.length; i++) {
    const item = jsonData[i]

    if (typeof item !== 'object' || item === null) {
      errors.push(`第 ${i + 1} 筆資料: 格式錯誤`)
      continue
    }

    // Check if all expected headers exist
    const missingHeaders = expectedHeadersArray.filter(
      (header) => !(header in item)
    )
    if (missingHeaders.length > 0) {
      errors.push(`第 ${i + 1} 筆資料: 缺少欄位 ${missingHeaders.join(', ')}`)
    }

    // Check required fields
    if (requiredFields[listName]) {
      for (const fieldName of requiredFields[listName]) {
        if (
          item[fieldName] === undefined ||
          item[fieldName] === null ||
          item[fieldName] === ''
        ) {
          errors.push(`第 ${i + 1} 筆資料: 必填欄位 "${fieldName}" 為空`)
        }
      }
    }
  }

  return errors
}

/**
 * Format validation errors into a readable message
 */
const formatValidationErrors = (errors: string[]) => {
  if (errors.length === 0) return ''
  return `JSON 檔案含有錯誤:\n${errors.join('\n')}`
}

const validateListSpecificData: Record<
  CouncilListName,
  (jsonData: any[], context: KeystoneContext) => Promise<string[]>
> = {
  [CouncilListName.councilor]: async () => {
    // No specific validation needed for councilors
    return []
  },
  [CouncilListName.councilMember]: async (jsonData, context) => {
    const validationErrors: string[] = []
    await Promise.all(
      jsonData.map(async (item, index) => {
        const rowNum = index + 1
        const { councilor_slug, party_slug, councilMeeting_term, city } = item

        const councilor = await context.prisma.councilor.findFirst({
          where: { slug: councilor_slug },
        })
        if (!councilor) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: 找不到 slug 為 "${councilor_slug}" 的議員`
          )
        }

        const party = await context.prisma.party.findFirst({
          where: { slug: party_slug },
        })
        if (!party) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: 找不到 slug 為 "${party_slug}" 的政黨`
          )
        }

        const meeting = await context.prisma.councilMeeting.findFirst({
          where: { term: Number(councilMeeting_term), city },
        })
        if (!meeting) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: 找不到${CITY_LABEL[city]}第 ${councilMeeting_term} 屆的議會`
          )
        }
      })
    )
    return validationErrors
  },
  [CouncilListName.councilBill]: async (jsonData, context) => {
    const validationErrors: string[] = []
    await Promise.all(
      jsonData.map(async (item, index) => {
        const rowNum = index + 1
        const { councilMeeting_city, councilMeeting_term, councilor_slug } =
          item

        const meeting = await context.prisma.councilMeeting.findFirst({
          where: {
            term: Number(councilMeeting_term),
            city: councilMeeting_city,
          },
        })
        if (!meeting) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: 找不到${CITY_LABEL[councilMeeting_city]}第 ${councilMeeting_term} 屆的議會`
          )
        }

        const councilor = await context.prisma.councilor.findFirst({
          where: { slug: councilor_slug },
        })
        if (!councilor) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: 找不到 slug 為 "${councilor_slug}" 的議員`
          )
        }
        const councilMember = await context.prisma.councilMember.findFirst({
          where: {
            councilorId: councilor.id,
            councilMeetingId: meeting.id,
          },
        })
        if (!councilMember) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: 找不到議員 "${councilor_slug}" 在${CITY_LABEL[councilMeeting_city]}第 ${councilMeeting_term} 屆的屆資資料`
          )
        }
      })
    )
    return validationErrors
  },
}

const importHandlers: Record<
  CouncilListName,
  (jsonData: any[], context: KeystoneContext) => Promise<any[]>
> = {
  [CouncilListName.councilor]: async (jsonData, context) => {
    const queries: Promise<any>[] = []

    jsonData.forEach((item) => {
      const {
        name,
        slug,
        imageLink,
        externalLink,
        meetingTermCount,
        meetingTermCountInfo,
      } = item

      queries.push(
        context.prisma.Councilor.upsert({
          where: { slug },
          update: {
            name,
            imageLink,
            externalLink,
            meetingTermCount,
            meetingTermCountInfo,
          },
          create: {
            name,
            slug,
            imageLink,
            externalLink,
            meetingTermCount,
            meetingTermCountInfo,
          },
        })
      )
    })

    return queries
  },

  [CouncilListName.councilMember]: async (jsonData, context) => {
    const queries: Promise<any>[] = []

    for (const item of jsonData) {
      const {
        councilor_slug,
        party_slug,
        councilMeeting_term,
        type,
        constituency,
        city,
        administrativeDistrict,
        tooltip,
        note,
        proposalSuccessCount,
        relatedLink,
      } = item

      const councilorData = await context.prisma.councilor.findFirst({
        where: { slug: councilor_slug },
        select: { name: true },
      })

      const existingMember = await context.prisma.councilMember.findFirst({
        where: {
          councilor: { slug: councilor_slug },
          councilMeeting: { term: Number(councilMeeting_term) },
        },
        select: { id: true },
      })

      const commonData = {
        type,
        constituency: constituency ? Number(constituency) : null,
        city,
        administrativeDistrict,
        tooltip,
        note,
        labelForCMS: `${councilorData.name} | ${CITY_LABEL[city]} - 第 ${councilMeeting_term} 屆`,
        party: { connect: { slug: party_slug } },
        proposalSuccessCount,
        relatedLink,
      }

      if (existingMember) {
        queries.push(
          context.prisma.councilMember.update({
            where: { id: existingMember.id },
            data: commonData,
          })
        )
      } else {
        queries.push(
          context.prisma.councilMember.create({
            data: {
              ...commonData,
              councilor: { connect: { slug: councilor_slug } },
              councilMeeting: {
                connect: { term: Number(councilMeeting_term), city },
              },
            },
          })
        )
      }
    }

    return queries
  },
  [CouncilListName.councilBill]: async (jsonData, context) => {
    const queries: Promise<any>[] = []

    for (const item of jsonData) {
      const {
        slug,
        councilMeeting_city,
        councilMeeting_term,
        councilor_slug,
        date,
        title,
        summary,
        content,
        attendee,
        sourceLink,
      } = item

      const existingBill = await context.prisma.councilBill.findFirst({
        where: { slug },
        select: { id: true },
      })

      const councilMember = await context.prisma.councilMember.findFirst({
        where: {
          councilor: { slug: councilor_slug },
          councilMeeting: {
            term: Number(councilMeeting_term),
            city: councilMeeting_city,
          },
        },
        select: { id: true },
      })

      const commonData = {
        date: new Date(date),
        title,
        summary,
        content,
        attendee,
        sourceLink,
        councilMember: { connect: { id: councilMember.id } },
        councilMeeting: {
          connect: {
            term: Number(councilMeeting_term),
            city: councilMeeting_city,
          },
        },
      }

      if (existingBill) {
        queries.push(
          context.prisma.councilBill.update({
            where: { id: existingBill.id },
            data: commonData,
          })
        )
      } else {
        queries.push(
          context.prisma.councilBill.create({
            data: {
              slug,
              ...commonData,
            },
          })
        )
      }
    }

    return queries
  },
}

async function executeImportQueries(
  queries: Promise<any>[],
  context: KeystoneContext
) {
  if (queries.length === 0) return

  try {
    const result = await context.prisma.$transaction(queries)
    const errors = result.filter((item) => item instanceof GraphQLError)

    if (errors.length) {
      const errorMessages = errors.map((err) => {
        return err.extensions?.debug?.message
          ? `${err.extensions.debug.message}`.trim()
          : err.message
      })

      throw new Error(
        `Transaction failed with the following errors: \n${errorMessages.join(
          '\n\n'
        )}`
      )
    }
  } catch (error) {
    throw new Error(`上傳失敗: ${error.message || error}`)
  }
}

const listConfigurations = list({
  fields: {
    recordName: text({
      label: '紀錄名稱',
      validation: { isRequired: true },
    }),
    uploadData: jsonUploader({
      label: '上傳資料',
      storage: 'files',
      validation: { isRequired: true },
    }),
    recordCount: integer({
      label: '筆數',
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    importer: relationship({
      ref: 'SystemUser',
      label: '匯入者',
      ui: {
        labelField: 'name',
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
      initialColumns: ['recordName', 'recordCount', 'createdAt', 'updatedAt'],
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
      create: async ({ resolvedData, inputData, context }) => {
        // importer
        const { session } = context
        resolvedData.importer = { connect: { id: Number(session.itemId) } }

        // record count - get from input uploadData (not saved to DB)
        if (
          inputData.uploadData?.jsonData &&
          Array.isArray(inputData.uploadData.jsonData)
        ) {
          resolvedData.recordCount = inputData.uploadData.jsonData.length
        }

        return resolvedData
      },
    },

    validate: {
      create: async ({ inputData, addValidationError, context }) => {
        if (!inputData.uploadData) {
          addValidationError('請上傳資料')
          return
        }

        const { listName, jsonData } = inputData.uploadData

        if (!listName) {
          addValidationError('請選擇匯入項目')
          return
        }

        if (!jsonData) {
          addValidationError('請上傳 JSON 檔案')
          return
        }

        // Validate JSON structure (headers and required fields)
        const structureErrors = validateJsonStructure(
          jsonData,
          listName,
          councilExpectedHeaders,
          councilRequiredFields
        )
        if (structureErrors.length > 0) {
          addValidationError(formatValidationErrors(structureErrors))
          return
        }

        if (validateListSpecificData[listName as CouncilListName]) {
          const specificErrors = await validateListSpecificData[
            listName as CouncilListName
          ](jsonData, context)
          if (specificErrors.length > 0) {
            addValidationError(formatValidationErrors(specificErrors))
          }
        }
      },
    },

    beforeOperation: {
      create: async ({ inputData, context }) => {
        if (!inputData.uploadData) return

        const { listName, jsonData } = inputData.uploadData

        if (!listName || !jsonData) return

        const importHandler = importHandlers[listName as CouncilListName]
        if (!importHandler) return

        try {
          const queries = await importHandler(jsonData, context)
          await executeImportQueries(queries, context)
        } catch (error) {
          logger.error('Failed to import data', { error, listName })
          throw error
        }
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
