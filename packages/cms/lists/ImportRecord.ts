import { GraphQLError } from 'graphql'
import { list } from '@keystone-6/core'
import type { KeystoneContext } from '@keystone-6/core/types'
import { text, relationship, integer } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  excludeReadOnlyRoles,
  RoleEnum,
  hideReadOnlyRoles,
} from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'
import {
  uploader,
  ListName,
  expectedHeaders,
  requiredFields,
} from './fields/uploader'
import { getTwreporterArticle } from './views/related-article/util'
import env from '../environment-variables'

/**
 * Validate CSV structure against expected headers and required fields
 */
const validateCsvStructure = (
  csvData: string[][],
  listName: string,
  expectedHeaders: Record<string, string[]>,
  requiredFields: Record<string, string[]>
) => {
  const errors = []
  const csvHeader = csvData[0]

  // Validate headers
  const expectedHeadersArray = expectedHeaders[listName]
  if (
    csvHeader.length !== expectedHeadersArray.length ||
    !csvHeader.every((header, index) => header === expectedHeadersArray[index])
  ) {
    errors.push(
      `CSV 檔案標題格式不符\n上傳內容標題: ${csvHeader.join(
        ','
      )}\n規格標題應為: ${expectedHeadersArray.join(
        ','
      )}\n請確認標題順序是否正確`
    )
    return errors // Early return for header problems
  }

  // Validate required fields and row structure
  const headerLength = csvHeader.length
  for (let i = 1; i < csvData.length; i++) {
    const row = csvData[i]

    // Skip empty rows (could be trailing newlines)
    if (row.length === 0 || (row.length === 1 && row[0] === '')) {
      continue
    }

    // Check if row length matches header length
    if (row.length !== headerLength) {
      errors.push(`第 ${i + 1} 行: 欄位數量不符`)
      continue
    }

    // Check for empty cells in required fields
    if (requiredFields[listName]) {
      for (let j = 0; j < row.length; j++) {
        const fieldName = csvHeader[j]
        if (requiredFields[listName].includes(fieldName) && row[j] === '') {
          errors.push(`第 ${i + 1} 行: 必填欄位 "${fieldName}" 為空`)
          break
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

  return `CSV 檔案含有錯誤:\n${errors.join('\n')}`
}

const validateListSpecificData: Record<
  ListName,
  (csvData: string[][], context: KeystoneContext) => Promise<string[]>
> = {
  [ListName.legislator]: async () => {
    // No specific validation needed for legislators
    return []
  },
  [ListName.topic]: async (csvData, context) => {
    const validationErrors: string[] = []
    await Promise.all(
      csvData
        .slice(1) // exclude header row
        .map(async ([_title, _slug, speech_slug], index) => {
          const rowNum = index + 1 // Add 1 for header row
          if (speech_slug) {
            const existingSpeech = await context.prisma.speech.findFirst({
              where: { slug: speech_slug },
            })
            if (!existingSpeech) {
              validationErrors.push(
                `第 ${rowNum} 行: 逐字稿 "${speech_slug}" 不存在，請先匯入逐字稿資料`
              )
            }
          }
        })
    )
    return validationErrors
  },
  [ListName.legislativeYuanMember]: async (csvData, context) => {
    const validationErrors: string[] = []
    await Promise.all(
      csvData
        .slice(1) // exclude header row
        .map(
          async (
            [
              _legislator_name,
              legislator_slug,
              party_slug,
              legislativeMeeting_term,
            ],
            index
          ) => {
            const rowNum = index + 1 // Add 1 for header row
            const legislator = await context.prisma.legislator.findFirst({
              where: { slug: legislator_slug },
            })
            if (!legislator) {
              validationErrors.push(
                `第 ${rowNum} 行: 立法委員 "${legislator_slug}" 不存在，請先匯入立法委員資料`
              )
            }
            const party = await context.prisma.party.findFirst({
              where: { slug: party_slug },
            })
            if (!party) {
              validationErrors.push(
                `第 ${rowNum} 行: 政黨 "${party_slug}" 不存在，請先匯入政黨資料`
              )
            }
            const meeting = await context.prisma.legislativeMeeting.findFirst({
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
        .slice(1) // exclude header row
        .map(
          async (
            [
              _slug,
              legislativeMeeting_term,
              legislativeMeetingSession_term,
              _legislator_name,
              legislator_slug,
              ..._rest
            ],
            index
          ) => {
            const rowNum = index + 1 // Add 1 for header row
            const meeting = await context.prisma.legislativeMeeting.findFirst({
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
              await context.prisma.legislativeMeetingSession.findFirst({
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
            const legislator = await context.prisma.legislator.findFirst({
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
              await context.prisma.legislativeYuanMember.findFirst({
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
        .slice(1) // exclude header row
        .map(
          async (
            [
              legislativeMeeting_term,
              legislativeMeetingSession_term,
              _legislator_name,
              legislator_slug,
              _committee_name,
              committee_slug,
            ],
            index
          ) => {
            const rowNum = index + 1 // Add 1 for header row
            const meeting = await context.prisma.legislativeMeeting.findFirst({
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
              await context.prisma.legislativeMeetingSession.findFirst({
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
            const legislator = await context.prisma.legislator.findFirst({
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
              await context.prisma.legislativeYuanMember.findFirst({
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
            const committeeData = await context.prisma.committee.findFirst({
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
  [ListName.relatedTopics]: async (csvData, context) => {
    const validationErrors: string[] = []
    await Promise.all(
      csvData
        .slice(1) // exclude header row
        .map(
          async (
            [_title, slug, _related_topic_title, related_topic_slug],
            index
          ) => {
            const rowNum = index + 1 // Add 1 for header row
            const topic = await context.prisma.topic.findFirst({
              where: { slug },
            })
            if (!topic) {
              validationErrors.push(
                `第 ${rowNum} 行: 議題 "${slug}" 不存在，請先匯入議題資料`
              )
            }
            const relatedTopic = await context.prisma.topic.findFirst({
              where: { slug: related_topic_slug },
            })
            if (!relatedTopic) {
              validationErrors.push(
                `第 ${rowNum} 行: 相關議題 "${related_topic_slug}" 不存在，請先匯入議題資料`
              )
            }
          }
        )
    )
    return validationErrors
  },
  [ListName.relatedArticles]: async (csvData, context) => {
    const validationErrors: string[] = []
    await Promise.all(
      csvData
        .slice(1) // exclude header row
        .map(async ([_title, slug, related_article_slug], index) => {
          const rowNum = index + 1 // Add 1 for header row
          const topic = await context.prisma.topic.findFirst({
            where: { slug },
          })
          if (!topic) {
            validationErrors.push(
              `第 ${rowNum} 行: 議題 "${slug}" 不存在，請先匯入議題資料`
            )
          }
          try {
            const relatedArticle = await getTwreporterArticle(
              related_article_slug,
              env.twreporterApiUrl
            )
            if (!relatedArticle) {
              validationErrors.push(
                `第 ${rowNum} 行: 相關文章 "${related_article_slug}" 不存在，請確認 slug 是否正確`
              )
            }
          } catch (err) {
            console.error(
              `Failed to get twreporter article. slug: ${related_article_slug}, err: ${err}`
            )
            validationErrors.push(
              `第 ${rowNum} 行: 無法 retrieve 相關文章 "${related_article_slug}" ，請確認 slug 是否正確`
            )
          }
        })
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

    csvData
      .slice(1)
      .forEach(
        ([
          name,
          slug,
          imageLink,
          externalLink,
          meetingTermCount,
          meetingTermCountInfo,
        ]) => {
          queries.push(
            context.prisma.Legislator.upsert({
              where: { slug },
              update: {
                name,
                imageLink,
                externalLink,
                meetingTermCount: Number(meetingTermCount),
                meetingTermCountInfo,
              },
              create: {
                name,
                slug,
                imageLink,
                externalLink,
                meetingTermCount: Number(meetingTermCount),
                meetingTermCountInfo,
              },
            })
          )
        }
      )

    return queries
  },

  [ListName.topic]: async (csvData, context) => {
    const queries: Promise<any>[] = []

    // Group the data by post slug
    const groupedData: Record<
      string,
      {
        title: string
        slug: string
        speech_slugs: string[]
      }
    > = {}

    for (const [title, slug, speech_slug] of csvData.slice(1)) {
      const key = `${slug}`

      if (!groupedData[key]) {
        groupedData[key] = {
          title,
          slug,
          speech_slugs: [],
        }
      }

      if (!groupedData[key].speech_slugs.includes(speech_slug)) {
        groupedData[key].speech_slugs.push(speech_slug)
      }
    }

    for (const key in groupedData) {
      const { title, slug, speech_slugs } = groupedData[key]

      const existingTopic = await context.prisma.topic.findFirst({
        where: { slug },
        select: { id: true },
      })

      const speeches: { id: string }[] = await context.prisma.speech.findMany({
        where: {
          slug: {
            in: speech_slugs,
          },
        },
        select: { id: true },
      })

      if (existingTopic) {
        queries.push(
          context.prisma.topic.update({
            where: { id: existingTopic.id },
            data: {
              title,
              speeches: {
                connect: speeches.map((speech) => ({ id: speech.id })),
              },
            },
          })
        )
      } else {
        queries.push(
          context.prisma.topic.create({
            data: {
              slug,
              title,
              speeches: {
                connect: speeches.map((speech) => ({ id: speech.id })),
              },
            },
          })
        )
      }
    }
    return queries
  },

  [ListName.legislativeYuanMember]: async (csvData, context) => {
    const queries: Promise<any>[] = []

    for (const [
      _legislator_name,
      legislator_slug,
      party_slug,
      legislativeMeeting_term,
      type,
      constituency,
      city,
      tooltip,
      note,
      proposalSuccessCount,
    ] of csvData.slice(1)) {
      const legislatorData = await context.prisma.legislator.findFirst({
        where: { slug: legislator_slug },
        select: { name: true },
      })

      const existingMember =
        await context.prisma.legislativeYuanMember.findFirst({
          where: {
            legislator: { slug: legislator_slug },
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
        proposalSuccessCount: Number(proposalSuccessCount),
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
              legislativeMeeting: {
                connect: { term: Number(legislativeMeeting_term) },
              },
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
      _legislator_name,
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
      const existingSpeech = await context.prisma.speech.findFirst({
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

    // Group the data by legislativeMeeting_term, legislativeMeetingSession_term, and legislator_slug
    const groupedData: Record<
      string,
      {
        legislativeMeeting_term: number
        legislativeMeetingSession_term: number
        legislator_slug: string
        committee_slugs: string[]
      }
    > = {}

    for (const [
      legislativeMeeting_term,
      legislativeMeetingSession_term,
      _legislator_name,
      legislator_slug,
      _committee_name,
      committee_slug,
    ] of csvData.slice(1)) {
      const key = `${legislativeMeeting_term}_${legislativeMeetingSession_term}_${legislator_slug}`

      if (!groupedData[key]) {
        groupedData[key] = {
          legislativeMeeting_term: Number(legislativeMeeting_term),
          legislativeMeetingSession_term: Number(
            legislativeMeetingSession_term
          ),
          legislator_slug,
          committee_slugs: [],
        }
      }

      if (!groupedData[key].committee_slugs.includes(committee_slug)) {
        groupedData[key].committee_slugs.push(committee_slug)
      }
    }

    for (const key in groupedData) {
      const {
        legislativeMeeting_term,
        legislativeMeetingSession_term,
        legislator_slug,
        committee_slugs,
      } = groupedData[key]

      const legislativeYuanMember =
        await context.prisma.legislativeYuanMember.findFirst({
          where: {
            legislator: { slug: legislator_slug },
            legislativeMeeting: { term: legislativeMeeting_term },
          },
          select: { id: true },
        })

      const legislativeMeetingSession =
        await context.prisma.legislativeMeetingSession.findFirst({
          where: {
            legislativeMeeting: { term: legislativeMeeting_term },
            term: legislativeMeetingSession_term,
          },
          select: { id: true },
        })

      const committees: { id: string }[] =
        await context.prisma.committee.findMany({
          where: {
            slug: {
              in: committee_slugs,
            },
          },
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
              committee: {
                connect: committees.map((committee) => ({ id: committee.id })),
              },
            },
          })
        )
      } else {
        queries.push(
          context.prisma.committeeMember.create({
            data: {
              committee: {
                connect: committees.map((committee) => ({ id: committee.id })),
              },
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
  [ListName.relatedTopics]: async (csvData, context) => {
    const queries: Promise<any>[] = []

    for (const [
      _title,
      slug,
      _related_topic_title,
      related_topic_slug,
    ] of csvData.slice(1)) {
      const relatedTopic = await context.prisma.Topic.findFirst({
        where: { slug: related_topic_slug },
        select: { id: true },
      })

      if (relatedTopic) {
        queries.push(
          context.prisma.Topic.update({
            where: { slug },
            data: {
              relatedTopics: {
                connect: { id: relatedTopic.id },
              },
            },
          })
        )
      } else {
        console.error(`Related topic not found for slug: ${related_topic_slug}`)
      }
    }

    return queries
  },
  [ListName.relatedArticles]: async (csvData, context) => {
    const queries: Promise<any>[] = []

    // { [topicSlug]: [<related article slug 1>, <related article slug 2>] }
    type TopicToUpdate = {
      [topicSlug: string]: string[]
    }
    const topicToUpdate: TopicToUpdate = {}

    for (const [_title, slug, related_article_slug] of csvData.slice(1)) {
      if (slug in topicToUpdate) {
        topicToUpdate[slug] = topicToUpdate[slug].filter(
          (articleSlug) => articleSlug !== related_article_slug
        )
        topicToUpdate[slug].unshift(related_article_slug)
      } else {
        const targetTopic = await context.prisma.topic.findFirst({
          where: { slug },
          select: { relatedTwreporterArticles: true },
        })

        if (targetTopic) {
          if (!targetTopic.relatedTwreporterArticles) {
            topicToUpdate[slug] = []
          } else {
            topicToUpdate[slug] = targetTopic.relatedTwreporterArticles.filter(
              (articleSlug: string) => articleSlug !== related_article_slug
            )
          }
          topicToUpdate[slug].unshift(related_article_slug)
        } else {
          console.error(`target topic not found for slug: ${slug}`)
        }
      }
    }

    for (const [topicSlug, relatedArticleSlugs] of Object.entries(
      topicToUpdate
    )) {
      queries.push(
        context.prisma.topic.update({
          where: { slug: topicSlug },
          data: {
            relatedTwreporterArticles: relatedArticleSlugs,
          },
        })
      )
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
      isOrderable: false,
    }),
    uploadData: uploader({
      label: '上傳資料',
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
      },
    }),
    createdAt: CREATED_AT({ isOrderable: false }),
    updatedAt: UPDATED_AT({ isOrderable: false }),
  },

  ui: {
    label: '資料匯入',
    labelField: 'recordName',
    listView: {
      initialColumns: [
        'recordName',
        // 'uploadData',
        'recordCount',
        'createdAt',
        'updatedAt',
      ],
      initialSort: { field: 'id', direction: 'DESC' },
      pageSize: 10,
    },
    hideDelete: ({ session }) => {
      const role = session?.data?.role
      if ([RoleEnum.Owner].includes(role)) {
        return true
      }
      return false
    },
    itemView: { defaultFieldMode: 'read' },
    hideCreate: hideReadOnlyRoles,
  },

  access: {
    operation: {
      query: allowAllRoles(),
      create: excludeReadOnlyRoles(),
      update: excludeReadOnlyRoles(),
      delete: excludeReadOnlyRoles(),
    },
  },

  hooks: {
    resolveInput: {
      create: ({ resolvedData, context }) => {
        // importer
        const { session } = context
        resolvedData.importer = { connect: { id: Number(session.itemId) } }

        // record count
        const { csvData } = resolvedData.uploadData
        if (csvData && csvData.length > 0) {
          resolvedData.recordCount = csvData.length - 1 // Exclude header row
        }

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
