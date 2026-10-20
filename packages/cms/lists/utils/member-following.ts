import { list } from '@keystone-6/core'
import { checkbox, relationship, select } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  hideReadOnlyRoles,
  withReadOnlyRoleFieldMode,
} from './access-control-list'
import { CREATED_AT } from './common-field'

type FollowingTarget = {
  model: string
  label: string
  labelField: string
}

const fieldNameOf = (model: string) => model[0].toLowerCase() + model.slice(1)

// Keystone relationships are nullable and SET NULL by default. A following
// record must always point to existing rows, so every relation is made required
// and is removed together with whichever parent is deleted.
const requireCascadeRelation = (schema: string, model: string) => {
  const field = fieldNameOf(model)
  return schema
    .replace(new RegExp(`(\\b${field}\\s+${model})\\?`), '$1')
    .replace(new RegExp(`(\\b${field}Id\\s+Int)\\?`), '$1')
    .replace(
      new RegExp(
        `(@relation\\("[^"]+_${field}", fields: \\[${field}Id\\], references: \\[id\\])\\)`
      ),
      '$1, onDelete: Cascade)'
    )
}

// An explicit join list preserves the time a member started following; the
// database, not a read-then-write check, enforces one row per combination.
function buildFollowingList({
  targets,
  label,
  source,
  withSessions = false,
}: {
  targets: FollowingTarget[]
  label: string
  source?: { value: string; label: string }[]
  withSessions?: boolean
}) {
  const targetFields = targets.map(({ model }) => fieldNameOf(model))

  return list({
    fields: {
      member: relationship({
        ref: 'Member',
        label: '會員',
        ui: { labelField: 'name' },
      }),
      ...Object.fromEntries(
        targets.map((target) => [
          fieldNameOf(target.model),
          relationship({
            ref: target.model,
            label: target.label,
            ui: { labelField: target.labelField },
          }),
        ])
      ),
      // A session set cannot live in the unique key, so the scope is an
      // attribute of the follow rather than part of its identity. The flag is
      // stored instead of enumerating sessions so that sessions added later are
      // still covered by a "all sessions" follow.
      ...(withSessions
        ? {
            allSessions: checkbox({
              label: '全部會期',
              defaultValue: true,
            }),
            sessions: relationship({
              ref: 'LegislativeMeetingSession',
              label: '指定會期',
              many: true,
              ui: {
                labelField: 'labelForCMS',
                description: '僅在未勾選「全部會期」時使用',
              },
            }),
          }
        : {}),
      // Records which page the member followed from, so the pair can be shown
      // in the order they encountered it.
      ...(source
        ? {
            source: select({
              label: '追蹤來源',
              options: source,
              defaultValue: source[0].value,
              validation: { isRequired: true },
            }),
          }
        : {}),
      createdAt: CREATED_AT(),
    },
    db: {
      extendPrismaSchema: (schema) => {
        const withRelations = ['Member', ...targets.map((t) => t.model)].reduce(
          requireCascadeRelation,
          schema
        )
        const uniqueColumns = ['memberId', ...targetFields.map((f) => `${f}Id`)]
        return withRelations.replace(
          /\n}$/,
          `\n  @@unique([${uniqueColumns.join(', ')}])\n}`
        )
      },
    },
    ui: {
      label: `會員追蹤${label}`,
      listView: {
        initialColumns: [
          'id',
          'member',
          ...targetFields,
          ...(withSessions ? ['allSessions'] : []),
          'createdAt',
        ],
        initialSort: { field: 'createdAt', direction: 'DESC' },
        pageSize: 50,
      },
      itemView: { defaultFieldMode: withReadOnlyRoleFieldMode },
      hideCreate: hideReadOnlyRoles,
      hideDelete: hideReadOnlyRoles,
    },
    access: {
      operation: {
        query: allowAllRoles(),
        create: allowAllRoles(),
        // The session scope is editable after the fact, so the API account
        // needs update. The validate hook below keeps identity immutable.
        update: allowAllRoles(),
        delete: allowAllRoles(),
      },
    },
    hooks: {
      validate: {
        create: ({ resolvedData, addValidationError }) => {
          const missing = ['member', ...targetFields].some(
            (field) => !resolvedData[field]?.connect
          )
          if (missing) addValidationError('必須選擇會員及追蹤對象')
        },
        update: ({ resolvedData, addValidationError }) => {
          // Only the session scope and source may change; repointing a row at
          // another member or target would hand one member another's record.
          const repointed = ['member', ...targetFields].some(
            (field) => resolvedData[field] !== undefined
          )
          if (repointed) addValidationError('追蹤不能變更會員或追蹤對象')
        },
      },
    },
  })
}

export function memberFollowingList(
  target:
    | 'CouncilMember'
    | 'LegislativeYuanMember'
    | 'Speech'
    | 'CouncilBill'
    | 'CouncilSpeech',
  label: string,
  targetLabelField: string
) {
  return buildFollowingList({
    targets: [{ model: target, label, labelField: targetLabelField }],
    label,
    // The legislator page filters by session, so a follow made there carries
    // the session scope. A speech already belongs to one session.
    withSessions: target === 'LegislativeYuanMember',
  })
}

// Topic and Legislator have no direct relation; they only meet through
// speeches. The saved meeting term records which term the member was viewing.
export function memberFollowingComboList(
  combo: 'TopicLegislator' | 'CouncilTopicCouncilor'
) {
  return combo === 'TopicLegislator'
    ? buildFollowingList({
        label: '議題與立委',
        withSessions: true,
        targets: [
          { model: 'Topic', label: '議題', labelField: 'title' },
          { model: 'Legislator', label: '立委', labelField: 'name' },
          { model: 'LegislativeMeeting', label: '屆期', labelField: 'term' },
        ],
        source: [
          { value: 'topic', label: '議題頁' },
          { value: 'legislator', label: '立委頁' },
        ],
      })
    : buildFollowingList({
        label: '縣市議題與議員',
        targets: [
          { model: 'CouncilTopic', label: '縣市議題', labelField: 'title' },
          { model: 'Councilor', label: '縣市議員', labelField: 'name' },
          {
            model: 'CouncilMeeting',
            label: '屆期',
            labelField: 'labelForCMS',
          },
        ],
        source: [
          { value: 'topic', label: '縣市議題頁' },
          { value: 'councilor', label: '縣市議員頁' },
        ],
      })
}

// A topic is only meaningful within the term the member was viewing, so the
// follow keeps that meeting the same way the combinations above do.
export function memberFollowingTopicList(topic: 'Topic' | 'CouncilTopic') {
  return topic === 'Topic'
    ? buildFollowingList({
        label: '議題',
        withSessions: true,
        targets: [
          { model: 'Topic', label: '議題', labelField: 'title' },
          { model: 'LegislativeMeeting', label: '屆期', labelField: 'term' },
        ],
      })
    : buildFollowingList({
        label: '縣市議題',
        targets: [
          { model: 'CouncilTopic', label: '縣市議題', labelField: 'title' },
          {
            model: 'CouncilMeeting',
            label: '屆期',
            labelField: 'labelForCMS',
          },
        ],
      })
}
