import { list } from '@keystone-6/core'
import { text, password, select } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    name: text({
      label: '姓名',
      validation: { isRequired: true },
    }),
    email: text({
      label: 'Email',
      validation: { isRequired: true },
      isIndexed: 'unique',
      isFilterable: true,
    }),
    password: password({
      label: '密碼',
      validation: { isRequired: true },
    }),
    role: select({
      label: '角色權限',
      type: 'string',
      options: [
        {
          label: RoleEnum.Owner,
          value: RoleEnum.Owner,
        },
        {
          label: RoleEnum.Admin,
          value: RoleEnum.Admin,
        },
        {
          label: RoleEnum.Editor,
          value: RoleEnum.Editor,
        },
        {
          label: RoleEnum.Headless,
          value: RoleEnum.Headless,
        },
      ],
      validation: { isRequired: true },
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    isHidden: ({ session }) => {
      if ([RoleEnum.Owner, RoleEnum.Admin].includes(session?.data.role)) {
        return false
      } else {
        return true
      }
    },
    listView: {
      initialColumns: ['name', 'role'],
    },
    itemView: {
      defaultFieldMode: ({ session }) => {
        if ([RoleEnum.Owner, RoleEnum.Admin].includes(session?.data.role)) {
          return 'edit'
        } else {
          return 'read'
        }
      },
    },
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
      update: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
      delete: allowRoles([RoleEnum.Owner, RoleEnum.Admin]),
    },
    item: {
      update: ({ session, inputData, item }) => {
        const userRole = session?.data?.role
        const userEmail = session?.data?.email

        // only owner and admin roles can update the items without further checking
        if ([RoleEnum.Owner, RoleEnum.Admin].includes(userRole)) {
          return true
        }

        // headless account cannot update anything
        if ([RoleEnum.Headless].includes(userRole)) {
          return false
        }

        if (
          // session user updates her/his password
          item?.email === userEmail &&
          // `inputData` only contains `password` property
          Object.keys(inputData).length === 1 &&
          inputData?.password
        ) {
          return true
        }

        return false
      },
    },
  },
  hooks: {},
})

export default listConfigurations
