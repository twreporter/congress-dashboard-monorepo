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
import { isRelatedType } from './views/related-article/types'
// @shared
import {
  CITY_LABEL,
  CITY,
} from '@twreporter/congress-dashboard-shared/lib/constants/city'
import { isValidDistrict } from '@twreporter/congress-dashboard-shared/lib/constants/city-district'

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
        const {
          councilor_slug,
          party_slug,
          councilMeeting_term,
          city,
          relatedLink,
          administrativeDistrict,
        } = item

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

        if (!Object.values(CITY).includes(city)) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: city 欄位值 "${city}" 非有效的縣市代碼`
          )
        }

        if (!Array.isArray(administrativeDistrict)) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: administrativeDistrict 欄位必須為陣列`
          )
        } else {
          for (const district of administrativeDistrict) {
            if (!isValidDistrict(city, district)) {
              validationErrors.push(
                `第 ${rowNum} 筆資料: administrativeDistrict 欄位值 "${district}" 非有效的${CITY_LABEL[city]}行政區`
              )
            }
          }
        }

        const meeting = await context.prisma.councilMeeting.findFirst({
          where: { term: Number(councilMeeting_term), city },
        })
        if (!meeting) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: 找不到${CITY_LABEL[city]}第 ${councilMeeting_term} 屆的議會`
          )
        }

        if (!Array.isArray(relatedLink)) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: relatedLink 欄位必須為陣列`
          )
        } else {
          // relatedLink 內的每個物件需包含 url 和 label
          for (const link of relatedLink) {
            if (typeof link !== 'object' || link === null) {
              validationErrors.push(
                `第 ${rowNum} 筆資料: relatedLink 內的每個物件必須為物件`
              )
              continue
            }
            if (!('url' in link) || !('label' in link)) {
              validationErrors.push(
                `第 ${rowNum} 筆資料: relatedLink 內的每個物件必須包含 url 和 label`
              )
            }
          }
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

        if (!Object.values(CITY).includes(councilMeeting_city)) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: councilMeeting_city 欄位值 "${councilMeeting_city}" 非有效的縣市代碼`
          )
        }

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

        if (!Array.isArray(councilor_slug)) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: councilor_slug 欄位必須為陣列`
          )
          return
        }

        if (councilor_slug.length === 0) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: councilor_slug 陣列不可為空`
          )
        } else {
          const councilors = await context.prisma.councilor.findMany({
            where: { slug: { in: councilor_slug } },
            select: { id: true, slug: true },
          })
          const foundSlugs = new Set(councilors.map((c) => c.slug))

          for (const slug of councilor_slug) {
            if (!foundSlugs.has(slug)) {
              validationErrors.push(
                `第 ${rowNum} 筆資料: 找不到 slug 為 "${slug}" 的議員`
              )
            }
          }

          if (meeting && councilors.length > 0) {
            const councilorIds = councilors.map((c) => c.id)
            const councilMembers = await context.prisma.councilMember.findMany({
              where: {
                councilorId: { in: councilorIds },
                councilMeetingId: meeting.id,
              },
              select: { councilorId: true },
            })
            const memberCouncilorIds = new Set(
              councilMembers.map((cm) => cm.councilorId)
            )
            const councilorsWithoutMemberRecord = councilors.filter(
              (c) => !memberCouncilorIds.has(c.id)
            )

            for (const c of councilorsWithoutMemberRecord) {
              validationErrors.push(
                `第 ${rowNum} 筆資料: 找不到議員 "${c.slug}" 在${CITY_LABEL[councilMeeting_city]}第 ${councilMeeting_term} 屆的屆資資料`
              )
            }
          }
        }
      })
    )
    return validationErrors
  },
  [CouncilListName.councilTopic]: async (jsonData, context) => {
    const validationErrors: string[] = []
    await Promise.all(
      jsonData.map(async (item, index) => {
        const rowNum = index + 1
        const { relatedTwreporterArticle, relatedCouncilBill } = item

        if (relatedTwreporterArticle) {
          for (const relatedItem of relatedTwreporterArticle) {
            if (!isRelatedType(relatedItem.type)) {
              validationErrors.push(
                `第 ${rowNum} 筆資料: relatedTwreporterArticle 的 type 應為 www-article 或 www-topic`
              )
            }
          }
        }

        if (relatedCouncilBill) {
          for (const relatedItem of relatedCouncilBill) {
            const councilBill = await context.prisma.councilBill.findFirst({
              where: { slug: relatedItem },
            })
            if (!councilBill) {
              validationErrors.push(
                `第 ${rowNum} 筆資料: 找不到 slug 為 "${relatedItem}" 的縣市議案`
              )
            }
          }
        }
      })
    )
    return validationErrors
  },
  [CouncilListName.councilTopicRelatedLegislativeTopic]: async (
    jsonData,
    context
  ) => {
    const validationErrors: string[] = []
    await Promise.all(
      jsonData.map(async (item, index) => {
        const rowNum = index + 1
        const { councilTopic_slug, legislativeTopic_slug } = item

        for (const legislativeTopicSlug of legislativeTopic_slug) {
          const legislativeTopic = await context.prisma.Topic.findFirst({
            where: { slug: legislativeTopicSlug },
          })
          if (!legislativeTopic) {
            validationErrors.push(
              `第 ${rowNum} 筆資料: 找不到 slug 為 "${legislativeTopicSlug}" 的立法院議題`
            )
          }
        }

        const councilTopic = await context.prisma.CouncilTopic.findFirst({
          where: { slug: councilTopic_slug },
        })
        if (!councilTopic) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: 找不到 slug 為 "${councilTopic_slug}" 的縣市議題`
          )
        }
      })
    )
    return validationErrors
  },
  [CouncilListName.councilTopicRelatedCouncilTopic]: async (
    jsonData,
    context
  ) => {
    const validationErrors: string[] = []
    await Promise.all(
      jsonData.map(async (item, index) => {
        const rowNum = index + 1
        const { councilTopic_slug, relatedCouncilTopic_slug } = item

        for (const relatedCouncilTopicSlug of relatedCouncilTopic_slug) {
          if (relatedCouncilTopicSlug === councilTopic_slug) {
            validationErrors.push(
              `第 ${rowNum} 筆資料: 相關縣市議題不能與本身議題相同`
            )
          }
          const relatedCouncilTopic =
            await context.prisma.CouncilTopic.findFirst({
              where: { slug: relatedCouncilTopicSlug },
            })
          if (!relatedCouncilTopic) {
            validationErrors.push(
              `第 ${rowNum} 筆資料: 找不到 slug 為 "${relatedCouncilTopicSlug}" 的相關縣市議題`
            )
          }
        }

        const councilTopic = await context.prisma.CouncilTopic.findFirst({
          where: { slug: councilTopic_slug },
        })
        if (!councilTopic) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: 找不到 slug 為 "${councilTopic_slug}" 的縣市議題`
          )
        }
      })
    )
    return validationErrors
  },
  [CouncilListName.councilTopicRelatedCityTopic]: async (jsonData, context) => {
    const validationErrors: string[] = []
    await Promise.all(
      jsonData.map(async (item, index) => {
        const rowNum = index + 1
        const { councilTopic_slug, relatedCityCouncilTopic_slug } = item

        for (const relatedCityCouncilTopicSlug of relatedCityCouncilTopic_slug) {
          if (relatedCityCouncilTopicSlug === councilTopic_slug) {
            validationErrors.push(
              `第 ${rowNum} 筆資料: 相關同縣市議題不能與本身議題相同`
            )
          }
          const relatedCityCouncilTopic =
            await context.prisma.CouncilTopic.findFirst({
              where: { slug: relatedCityCouncilTopicSlug },
            })
          if (!relatedCityCouncilTopic) {
            validationErrors.push(
              `第 ${rowNum} 筆資料: 找不到 slug 為 "${relatedCityCouncilTopicSlug}" 的相關同縣市議題`
            )
          }
        }

        const councilTopic = await context.prisma.CouncilTopic.findFirst({
          where: { slug: councilTopic_slug },
        })
        if (!councilTopic) {
          validationErrors.push(
            `第 ${rowNum} 筆資料: 找不到 slug 為 "${councilTopic_slug}" 的縣市議題`
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
        relatedLink,
      } = item

      const councilorData = await context.prisma.councilor.findFirst({
        where: { slug: councilor_slug },
        select: { name: true },
      })

      const existingMember = await context.prisma.councilMember.findFirst({
        where: {
          councilor: { slug: councilor_slug },
          councilMeeting: { term: Number(councilMeeting_term), city },
        },
        select: { id: true },
      })

      const councilMeeting = await context.prisma.councilMeeting.findFirst({
        where: { term: Number(councilMeeting_term), city },
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
                connect: { id: councilMeeting.id },
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

      const councilMembers = await context.prisma.councilMember.findMany({
        where: {
          councilor: { slug: { in: councilor_slug } },
          councilMeeting: {
            term: Number(councilMeeting_term),
            city: councilMeeting_city,
          },
        },
        select: { id: true },
      })
      const councilMemberIds = councilMembers.map(({ id }) => ({ id }))

      const councilMeeting = await context.prisma.councilMeeting.findFirst({
        where: {
          term: Number(councilMeeting_term),
          city: councilMeeting_city,
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
        councilMember: { connect: councilMemberIds },
        councilMeeting: {
          connect: { id: councilMeeting.id },
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
  [CouncilListName.councilTopic]: async (jsonData, context) => {
    const queries: Promise<any>[] = []

    jsonData.forEach((item) => {
      const {
        title,
        slug,
        city,
        type,
        relatedTwreporterArticle,
        relatedCouncilBill,
      } = item

      const labelForCMS = `${CITY_LABEL[city]}-${title}`

      queries.push(
        context.prisma.CouncilTopic.upsert({
          where: { slug },
          update: {
            title,
            city,
            type,
            labelForCMS,
            relatedTwreporterArticle,
            bill: { connect: relatedCouncilBill.map((slug) => ({ slug })) },
          },
          create: {
            title,
            slug,
            city,
            type,
            labelForCMS,
            relatedTwreporterArticle,
            bill: { connect: relatedCouncilBill.map((slug) => ({ slug })) },
          },
        })
      )
    })

    return queries
  },
  [CouncilListName.councilTopicRelatedLegislativeTopic]: async (
    jsonData,
    context
  ) => {
    const queries: Promise<any>[] = []

    jsonData.forEach((item) => {
      const { councilTopic_slug, legislativeTopic_slug } = item

      queries.push(
        context.prisma.CouncilTopic.update({
          where: { slug: councilTopic_slug },
          data: {
            relatedLegislativeTopic: {
              connect: legislativeTopic_slug.map((slug) => ({ slug })),
            },
          },
        })
      )
    })

    return queries
  },
  [CouncilListName.councilTopicRelatedCouncilTopic]: async (
    jsonData,
    context
  ) => {
    const queries: Promise<any>[] = []

    jsonData.forEach((item) => {
      const { councilTopic_slug, relatedCouncilTopic_slug } = item

      queries.push(
        context.prisma.CouncilTopic.update({
          where: { slug: councilTopic_slug },
          data: {
            relatedCouncilTopic: {
              connect: relatedCouncilTopic_slug.map((slug) => ({ slug })),
            },
          },
        })
      )
    })

    return queries
  },
  [CouncilListName.councilTopicRelatedCityTopic]: async (jsonData, context) => {
    const queries: Promise<any>[] = []

    jsonData.forEach((item) => {
      const { councilTopic_slug, relatedCityCouncilTopic_slug } = item

      queries.push(
        context.prisma.CouncilTopic.update({
          where: { slug: councilTopic_slug },
          data: {
            relatedCityCouncilTopic: {
              connect: relatedCityCouncilTopic_slug.map((slug) => ({ slug })),
            },
          },
        })
      )
    })

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
