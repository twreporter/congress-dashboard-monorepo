import { list } from '@keystone-6/core'
import { text, relationship, calendarDay } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
import { SLUG, CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    legislativeMeeting: relationship({
      ref: 'LegislativeMeeting',
      label: '所屬屆期',
      ui: {
        labelField: 'term',
      },
    }),
    legislativeMeetingSession: relationship({
      ref: 'LegislativeMeetingSession',
      label: '所屬會期',
      ui: {
        labelField: 'term',
      },
    }),
    legislator: relationship({
      ref: 'Legislator',
      label: '委員',
      ui: {
        labelField: 'name',
      },
    }),
    date: calendarDay({
      label: '日期',
      isIndexed: true,
      validation: {
        isRequired: true,
      },
    }),
    title: text({
      label: '標題',
      validation: { isRequired: true },
      isIndexed: true,
    }),
    slug: SLUG,
    summary: text({
      label: '簡介',
    }),
    // TODO: change to editor
    content: text({
      label: '內文',
    }),
    attendee: text({
      label: '列席質詢對象',
    }),
    ivodLink: text({
      label: 'ivod 連結',
    }),
    ivodStartTime: text({
      label: 'ivod 起始時間',
    }),
    ivodEndTime: text({
      label: 'ivod 結束時間',
    }),
    topics: relationship({
      ref: 'Topic.speeches',
      label: '所屬主題',
      many: true,
      ui: {
        labelField: 'title',
      },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: '逐字稿',
    labelField: 'title',
    listView: {
      initialColumns: [
        'title',
        'slug',
        'legislator',
        'legislativeMeeting',
        'legislativeMeetingSession',
      ],
      initialSort: { field: 'date', direction: 'DESC' },
      pageSize: 50,
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
})

export default listConfigurations
