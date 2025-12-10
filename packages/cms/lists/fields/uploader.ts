import {
  type BaseListTypeInfo,
  type CommonFieldConfig,
  type FieldTypeFunc,
  fieldType,
} from '@keystone-6/core/types'
import { graphql } from '@keystone-6/core'

export enum ListName {
  legislator = 'Legislator',
  topic = 'Topic',
  legislativeYuanMember = 'LegislativeYuanMember',
  speech = 'Speech',
  committeeMember = 'CommitteeMember',
  relatedTopics = 'RelatedTopics',
  relatedArticles = 'RelatedArticles',
}

export const expectedHeaders: Record<string, string[]> = {
  [ListName.legislator]: [
    'name',
    'slug',
    'imageLink',
    'externalLink',
    'meetingTermCount',
    'meetingTermCountInfo',
  ],
  [ListName.topic]: ['title', 'slug', 'speech_slug'],
  [ListName.legislativeYuanMember]: [
    'legislator_name',
    'legislator_slug',
    'party_slug',
    'legislativeMeeting_term',
    'type',
    'constituency',
    'city',
    'tooltip',
    'note',
    'proposalSuccessCount',
  ],
  [ListName.speech]: [
    'slug',
    'legislativeMeeting_term',
    'legislativeMeetingSession_term',
    'legislator_name',
    'legislator_slug',
    'date',
    'title',
    'summary',
    'content',
    'attendee',
    'ivodLink',
    'ivodStartTime',
    'ivodEndTime',
  ],
  [ListName.committeeMember]: [
    'legislativeMeeting_term',
    'legislativeMeetingSession_term',
    'legislator_name',
    'legislator_slug',
    'committee_name',
    'committee_slug',
  ],
  [ListName.relatedTopics]: [
    'title',
    'slug',
    'related_topic_title',
    'related_topic_slug',
  ],
  [ListName.relatedArticles]: [
    'title',
    'slug',
    'related_article_slug',
    'related_type',
  ],
}

export const requiredFields: Record<string, string[]> = {
  [ListName.legislator]: ['name', 'slug'],
  [ListName.topic]: ['title', 'slug'],
  [ListName.legislativeYuanMember]: [
    'legislator_slug',
    'party_slug',
    'legislativeMeeting_term',
    'type',
  ],
  [ListName.speech]: [
    'slug',
    'legislativeMeeting_term',
    'legislativeMeetingSession_term',
    'legislator_slug',
    'date',
    'title',
  ],
  [ListName.committeeMember]: [
    'legislativeMeeting_term',
    'legislativeMeetingSession_term',
    'legislator_slug',
    'committee_slug',
  ],
  [ListName.relatedTopics]: ['slug', 'related_topic_slug'],
  [ListName.relatedArticles]: ['slug', 'related_article_slug', 'related_type'],
}

export type UploaderFieldConfig<ListTypeInfo extends BaseListTypeInfo> =
  CommonFieldConfig<ListTypeInfo> & {
    validation?: {
      isRequired?: boolean
    }
  }

type UploaderInput = {
  listName: ListName | null | undefined
  csvData: string[][] | null | undefined
}

type UploaderOutput = {
  listName: ListName | null | undefined
  csvData: string[][] | null | undefined
}

// Create GraphQL enum values object
const createListNameEnum = () => {
  const enumValues: Record<string, { value: string }> = {}
  Object.values(ListName).forEach((value) => {
    enumValues[value] = { value }
  })
  return enumValues
}

const UploaderInputType = graphql.inputObject({
  name: 'UploaderInput',
  fields: {
    listName: graphql.arg({
      type: graphql.enum({
        name: 'ListNameEnum',
        values: createListNameEnum(),
      }),
    }),
    csvData: graphql.arg({ type: graphql.JSON }),
  },
})

const UploaderOutputType = graphql.object<UploaderOutput>()({
  name: 'UploaderOutput',
  fields: {
    listName: graphql.field({
      type: graphql.enum({
        name: 'ListNameOutputEnum',
        values: createListNameEnum(),
      }),
    }),
    csvData: graphql.field({ type: graphql.JSON }),
  },
})

// GraphQL Filter type
const UploaderFilter = graphql.inputObject({
  name: 'UploaderFilter',
  fields: {
    equals: graphql.arg({
      type: UploaderInputType,
    }),
  },
})

export function uploader<ListTypeInfo extends BaseListTypeInfo>(
  config: UploaderFieldConfig<ListTypeInfo> = {}
): FieldTypeFunc<ListTypeInfo> {
  function resolveInput(value: UploaderInput | null | undefined) {
    if (!value) return { listName: null, csvData: null }
    const { listName = null, csvData = null } = value
    return { listName, csvData }
  }

  function resolveOutput(value: UploaderOutput) {
    return value
  }

  function resolveWhere(
    value: null | { equals: UploaderInput | null | undefined }
  ) {
    if (value === null) throw new Error('UploaderFilter cannot be null')
    if (value.equals === undefined) return {}
    const { listName, csvData } = resolveInput(value.equals)

    const ret: Record<string, any> = {}
    if (listName !== null) {
      ret.listName = { equals: listName }
    }
    if (csvData !== null) {
      ret.csvData = { equals: csvData }
    }
    return ret
  }

  return (_meta) =>
    fieldType({
      kind: 'multi',
      fields: {
        listName: {
          kind: 'scalar',
          mode: config.validation?.isRequired ? 'required' : 'optional',
          scalar: 'String',
        },
        csvData: {
          kind: 'scalar',
          mode: config.validation?.isRequired ? 'required' : 'optional',
          scalar: 'Json',
        },
      },
    })({
      ...config,
      input: {
        where: {
          arg: graphql.arg({ type: UploaderFilter }),
          resolve(value, _context) {
            return resolveWhere(value)
          },
        },
        create: {
          arg: graphql.arg({ type: UploaderInputType }),
          resolve(value, _context) {
            return resolveInput(value)
          },
        },
        update: {
          arg: graphql.arg({ type: UploaderInputType }),
          resolve(value, _context) {
            return resolveInput(value)
          },
        },
      },
      output: graphql.field({
        type: UploaderOutputType,
        resolve({ value }) {
          return resolveOutput(value)
        },
      }),
      views: './lists/views/uploader-field/index.tsx',
      getAdminMeta() {
        const labelMap: Record<string, string> = {
          legislator: '立法委員',
          topic: '議題',
          legislativeYuanMember: '立委屆資',
          speech: '逐字稿',
          committeeMember: '委員會屆資',
          relatedTopics: '相關議題',
          relatedArticles: '相關文章',
        }

        return {
          listOptions: Object.entries(ListName).map(([key, value]) => ({
            label: labelMap[key] || key,
            value,
          })),
          expectedHeaders,
          requiredFields,
          isRequired: !!config.validation?.isRequired,
        }
      },
    })
}
