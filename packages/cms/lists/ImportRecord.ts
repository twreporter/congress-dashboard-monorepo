import { GraphQLError } from 'graphql'
import { list } from '@keystone-6/core'
import type { KeystoneContext } from '@keystone-6/core/types'
import { text, relationship } from '@keystone-6/core/fields'
import { allowAllRoles, denyRoles } from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'
import {
  validateCsvStructure,
  formatValidationErrors,
} from './utils/csv-validator'
import {
  uploader,
  ListName,
  expectedHeaders,
  requiredFields,
} from './fields/uploader'

const validateListSpecificData: Record<
  ListName,
  (csvData: string[][], context: KeystoneContext) => Promise<string[]>
> = {
  [ListName.legislator]: async () => {
    // No specific validation needed for legislators
    return []
  },
  [ListName.topic]: async () => {
    // No specific validation needed for topics
    return []
  },
  [ListName.legislativeYuanMember]: async (csvData, context) => {
    const validationErrors: string[] = []
    await Promise.all(
      csvData
        .slice(1)
        .map(
          async (
            [legislator_slug, party_slug, legislativeMeeting_term],
            index
          ) => {
            const rowNum = index + 1 // Add 1 for header row
            const legislator = await context.prisma.legislator.findUnique({
              where: { slug: legislator_slug },
            })
            if (!legislator) {
              validationErrors.push(
                `第 ${rowNum} 行: 立法委員 "${legislator_slug}" 不存在，請先匯入立法委員資料`
              )
            }
            const party = await context.prisma.party.findUnique({
              where: { slug: party_slug },
            })
            if (!party) {
              validationErrors.push(
                `第 ${rowNum} 行: 政黨 "${party_slug}" 不存在，請先匯入政黨資料`
              )
            }
            const meeting = await context.prisma.legislativeMeeting.findUnique({
              where: { term: Number(legislativeMeeting_term) },
            })
            if (!meeting) {
              validationErrors.push(
                `第 ${rowNum} 行: 屆期 第 ${legislativeMeeting_term} 屆 不存在，請先匯入屆期資料`
              )
            }
          }
        )
    )
    return validationErrors
  },
  [ListName.speech]: async (csvData, context) => {
    const validationErrors: string[] = []
    await Promise.all(
      csvData
        .slice(1)
        .map(
          async (
            [
              _slug,
              legislativeMeeting_term,
              legislativeMeetingSession_term,
              legislator_slug,
              ..._rest
            ],
            index
          ) => {
            const rowNum = index + 1 // Add 1 for header row
            const meeting = await context.prisma.legislativeMeeting.findUnique({
              where: { term: Number(legislativeMeeting_term) },
              select: { id: true },
            })
            if (!meeting) {
              validationErrors.push(
                `第 ${rowNum} 行: 屆期 第 ${legislativeMeeting_term} 屆 不存在，請先匯入屆期資料`
              )
              return // Skip further validation if meeting doesn't exist
            }
            const session =
              await context.prisma.legislativeMeetingSession.findUnique({
                where: {
                  term: Number(legislativeMeetingSession_term),
                  legislativeMeetingId: meeting.id,
                },
              })
            if (!session) {
              validationErrors.push(
                `第 ${rowNum} 行: 會期 第${legislativeMeeting_term}屆 第 ${legislativeMeetingSession_term} 會期 不存在，請先匯入會期資料`
              )
            }
            const legislator = await context.prisma.legislator.findUnique({
              where: { slug: legislator_slug },
              select: { id: true },
            })
            if (!legislator) {
              validationErrors.push(
                `第 ${rowNum} 行: 立法委員 "${legislator_slug}" 不存在，請先匯入立法委員資料`
              )
              return
            }
            const legislativeYuanMember =
              await context.prisma.legislativeYuanMember.findUnique({
                where: {
                  legislatorId: legislator.id,
                  legislativeMeetingId: meeting.id,
                },
              })

            if (!legislativeYuanMember) {
              validationErrors.push(
                `第 ${rowNum} 行: 立法委員 "${legislator_slug}" 在第 ${legislativeMeeting_term} 屆不存在，請先匯入立委屆期資料`
              )
            }
          }
        )
    )
    return validationErrors
  },
  [ListName.committeeMember]: async (csvData, context) => {
    const validationErrors: string[] = []

    await Promise.all(
      csvData
        .slice(1)
        .map(
          async (
            [
              legislativeMeeting_term,
              legislativeMeetingSession_term,
              legislator_slug,
              committee_slug,
            ],
            index
          ) => {
            const rowNum = index + 1 // Add 1 for header row
            const meeting = await context.prisma.legislativeMeeting.findUnique({
              where: { term: Number(legislativeMeeting_term) },
              select: { id: true },
            })
            if (!meeting) {
              validationErrors.push(
                `第 ${rowNum} 行: 屆期 第 ${legislativeMeeting_term} 屆 不存在，請先匯入屆期資料`
              )
              return // Skip further validation if meeting doesn't exist
            }
            const session =
              await context.prisma.legislativeMeetingSession.findUnique({
                where: {
                  term: Number(legislativeMeetingSession_term),
                  legislativeMeetingId: meeting.id,
                },
              })
            if (!session) {
              validationErrors.push(
                `第 ${rowNum} 行: 會期 第${legislativeMeeting_term}屆 第 ${legislativeMeetingSession_term} 會期 不存在，請先匯入會期資料`
              )
            }
            const legislator = await context.prisma.legislator.findUnique({
              where: { slug: legislator_slug },
              select: { id: true },
            })

            if (!legislator) {
              validationErrors.push(
                `第 ${rowNum} 行: 立法委員 "${legislator_slug}" 不存在，請先匯入立法委員資料`
              )
              return
            }
            const legislativeYuanMember =
              await context.prisma.legislativeYuanMember.findUnique({
                where: {
                  legislatorId: legislator.id,
                  legislativeMeetingId: meeting.id,
                },
              })

            if (!legislativeYuanMember) {
              validationErrors.push(
                `第 ${rowNum} 行: 立法委員 "${legislator_slug}" 在第 ${legislativeMeeting_term} 屆不存在，請先匯入立委屆期資料`
              )
            }
            const committeeData = await context.prisma.committee.findUnique({
              where: { slug: committee_slug },
              select: { id: true },
            })
            if (!committeeData) {
              validationErrors.push(
                `第 ${rowNum} 行: 委員會 "${committee_slug}" 不存在，請先匯入委員會資料`
              )
            }
          }
        )
    )
    return validationErrors
  },
}

const importHandlers: Record<
  ListName,
  (csvData: string[][], context: KeystoneContext) => Promise<any[]>
> = {
  [ListName.legislator]: async (csvData, context) => {
    const queries: Promise<any>[] = []

    csvData.slice(1).forEach(([name, slug, imageLink]) => {
      queries.push(
        context.prisma.Legislator.upsert({
          where: { slug },
          update: { name, imageLink },
          create: { name, slug, imageLink },
        })
      )
    })

    return queries
  },

  [ListName.topic]: async (csvData, context) => {
    const queries: Promise<any>[] = []

    csvData.slice(1).forEach(([title, slug]) => {
      queries.push(
        context.prisma.Topic.upsert({
          where: { slug },
          update: { title },
          create: { title, slug },
        })
      )
    })

    return queries
  },

  [ListName.legislativeYuanMember]: async (csvData, context) => {
    const queries: Promise<any>[] = []

    for (const [
      legislator_slug,
      party_slug,
      legislativeMeeting_term,
      type,
      constituency,
      city,
      tooltip,
      note,
    ] of csvData.slice(1)) {
      const legislatorData = await context.prisma.legislator.findUnique({
        where: { slug: legislator_slug },
        select: { name: true },
      })

      const existingMember =
        await context.prisma.legislativeYuanMember.findFirst({
          where: {
            legislator: { slug: legislator_slug },
            party: { slug: party_slug },
            legislativeMeeting: { term: Number(legislativeMeeting_term) },
          },
          select: { id: true },
        })

      const commonData = {
        type,
        constituency,
        city,
        tooltip,
        note,
        labelForCMS: `${legislatorData.name} | 第 ${legislativeMeeting_term} 屆`,
        party: { connect: { slug: party_slug } },
        legislativeMeeting: {
          connect: { term: Number(legislativeMeeting_term) },
        },
      }

      if (existingMember) {
        queries.push(
          context.prisma.legislativeYuanMember.update({
            where: { id: existingMember.id },
            data: commonData,
          })
        )
      } else {
        queries.push(
          context.prisma.legislativeYuanMember.create({
            data: {
              ...commonData,
              legislator: { connect: { slug: legislator_slug } },
            },
          })
        )
      }
    }

    return queries
  },

  [ListName.speech]: async (csvData, context) => {
    const queries: Promise<any>[] = []

    for (const [
      slug,
      legislativeMeeting_term,
      legislativeMeetingSession_term,
      legislator_slug,
      date,
      title,
      summary,
      content,
      attendee,
      ivodLink,
      ivodStartTime,
      ivodEndTime,
    ] of csvData.slice(1)) {
      const existingSpeech = await context.prisma.speech.findUnique({
        where: { slug },
        select: { id: true },
      })

      const legislativeYuanMember =
        await context.prisma.legislativeYuanMember.findFirst({
          where: {
            legislator: { slug: legislator_slug },
            legislativeMeeting: { term: Number(legislativeMeeting_term) },
          },
          select: { id: true },
        })

      const legislativeMeetingSession =
        await context.prisma.legislativeMeetingSession.findFirst({
          where: {
            legislativeMeeting: { term: Number(legislativeMeeting_term) },
            term: Number(legislativeMeetingSession_term),
          },
          select: { id: true },
        })

      const commonData = {
        title,
        date: new Date(date),
        summary,
        content,
        attendee,
        ivodLink,
        ivodStartTime,
        ivodEndTime,
        legislativeYuanMember: { connect: { id: legislativeYuanMember.id } },
        legislativeMeeting: {
          connect: { term: Number(legislativeMeeting_term) },
        },
        legislativeMeetingSession: {
          connect: { id: legislativeMeetingSession.id },
        },
      }

      if (existingSpeech) {
        queries.push(
          context.prisma.speech.update({
            where: { id: existingSpeech.id },
            data: commonData,
          })
        )
      } else {
        queries.push(
          context.prisma.speech.create({
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

  [ListName.committeeMember]: async (csvData, context) => {
    const queries: Promise<any>[] = []

    for (const [
      legislativeMeeting_term,
      legislativeMeetingSession_term,
      legislator_slug,
      committee_slug,
    ] of csvData.slice(1)) {
      const legislativeYuanMember =
        await context.prisma.legislativeYuanMember.findFirst({
          where: {
            legislator: { slug: legislator_slug },
            legislativeMeeting: { term: Number(legislativeMeeting_term) },
          },
          select: { id: true },
        })

      const legislativeMeetingSession =
        await context.prisma.legislativeMeetingSession.findFirst({
          where: {
            legislativeMeeting: { term: Number(legislativeMeeting_term) },
            term: Number(legislativeMeetingSession_term),
          },
          select: { id: true },
        })

      const committeeData = await context.prisma.committee.findUnique({
        where: { slug: committee_slug },
        select: { id: true },
      })

      const existingCommitteeMember =
        await context.prisma.committeeMember.findFirst({
          where: {
            legislativeYuanMember: { id: legislativeYuanMember.id },
            legislativeMeetingSession: { id: legislativeMeetingSession.id },
          },
          select: { id: true },
        })

      if (existingCommitteeMember) {
        queries.push(
          context.prisma.committeeMember.update({
            where: { id: existingCommitteeMember.id },
            data: {
              committee: { connect: { id: committeeData.id } },
            },
          })
        )
      } else {
        queries.push(
          context.prisma.committeeMember.create({
            data: {
              committee: { connect: { id: committeeData.id } },
              legislativeYuanMember: {
                connect: { id: legislativeYuanMember.id },
              },
              legislativeMeetingSession: {
                connect: { id: legislativeMeetingSession.id },
              },
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

    return result
  } catch (error) {
    throw new Error(`上傳失敗: ${error.message || error}`)
  }
}

// Main list configuration
const listConfigurations = list({
  fields: {
    recordName: text({
      label: '紀錄名稱',
      validation: { isRequired: true },
      ui: { itemView: { fieldMode: 'edit' } },
    }),
    uploadData: uploader({
      label: '上傳資料',
      validation: { isRequired: true },
    }),
    importer: relationship({
      ref: 'SystemUser',
      label: '匯入者',
      ui: {
        labelField: 'name',
        createView: { fieldMode: 'hidden' },
      },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },

  ui: {
    label: '資料匯入',
    labelField: 'recordName',
    listView: {
      initialColumns: ['recordName', 'uploadData', 'createdAt', 'updatedAt'],
      initialSort: { field: 'createdAt', direction: 'DESC' },
      pageSize: 50,
    },
    hideDelete: denyRoles(['admin']), // Only for development purposes
    itemView: { defaultFieldMode: 'read' },
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
      create: async ({ resolvedData, addValidationError, context }) => {
        if (!resolvedData.uploadData) {
          return addValidationError('匯入資料欄位為必填')
        }

        const { csvData, listName } = resolvedData.uploadData

        if (!listName) {
          return addValidationError('請選擇匯入項目')
        }

        if (!csvData) {
          return addValidationError('請上傳 CSV 檔案')
        }

        // Validate CSV structure (headers and required fields)
        const structureErrors = validateCsvStructure(
          csvData,
          listName,
          expectedHeaders,
          requiredFields
        )
        if (structureErrors.length > 0) {
          return addValidationError(formatValidationErrors(structureErrors))
        }

        if (validateListSpecificData[listName as ListName]) {
          const validationErrors = await validateListSpecificData[
            listName as ListName
          ](csvData, context)
          if (validationErrors.length > 0) {
            return addValidationError(
              `匯入資料有誤:\n${validationErrors.join('\n')}`
            )
          }
        }
      },
    },

    beforeOperation: {
      create: async ({ resolvedData, context }) => {
        if (!resolvedData.uploadData) return
        const { listName, csvData } = resolvedData.uploadData
        const importHandler = importHandlers[listName as ListName]
        if (!importHandler) return
        const queries = await importHandler(csvData, context)
        await executeImportQueries(queries, context)
      },
    },
  },
})

export default listConfigurations
