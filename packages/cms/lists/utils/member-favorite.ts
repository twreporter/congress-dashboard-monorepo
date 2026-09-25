import { list } from '@keystone-6/core'
import { relationship, select } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  allowRoles,
  hideReadOnlyRoles,
  RoleEnum,
  withReadOnlyRoleFieldMode,
} from './access-control-list'
import { CREATED_AT } from './common-field'

type FavoriteTarget = {
  model: string
  label: string
  labelField: string
}

const fieldNameOf = (model: string) => model[0].toLowerCase() + model.slice(1)

// Keystone relationships are nullable and SET NULL by default. A favorite must
// always point to existing records, so every relation is made required and is
// removed together with whichever parent is deleted.
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

// An explicit join list preserves the time of a favorite; the database, not a
// read-then-write check, enforces that each member saves a combination once.
function buildFavoriteList({
  targets,
  label,
  source,
}: {
  targets: FavoriteTarget[]
  label: string
  source?: { value: string; label: string }[]
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
      // Records which page the member saved from, so the pair can be shown in
      // the order they encountered it.
      ...(source
        ? {
            source: select({
              label: '收藏來源',
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
      label: `會員收藏${label}`,
      listView: {
        initialColumns: ['id', 'member', ...targetFields, 'createdAt'],
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
        update: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
        delete: allowAllRoles(),
      },
    },
    hooks: {
      validate: {
        create: ({ resolvedData, addValidationError }) => {
          const missing = ['member', ...targetFields].some(
            (field) => !resolvedData[field]?.connect
          )
          if (missing) addValidationError('必須選擇會員及收藏對象')
        },
        update: ({ resolvedData, addValidationError }) => {
          const removed = ['member', ...targetFields].some(
            (field) => resolvedData[field]?.disconnect
          )
          if (removed) addValidationError('收藏不能移除會員或收藏對象')
        },
      },
    },
  })
}

export function memberFavoriteList(
  target:
    | 'CouncilMember'
    | 'LegislativeYuanMember'
    | 'Speech'
    | 'CouncilBill'
    | 'CouncilSpeech',
  label: string,
  targetLabelField: string
) {
  return buildFavoriteList({
    targets: [{ model: target, label, labelField: targetLabelField }],
    label,
  })
}

// Topic and Legislator have no direct relation; they only meet through
// speeches. The saved meeting term records which term the member was viewing.
export function memberFavoriteComboList(
  combo: 'TopicLegislator' | 'CouncilTopicCouncilor'
) {
  return combo === 'TopicLegislator'
    ? buildFavoriteList({
        label: '議題與立委',
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
    : buildFavoriteList({
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
