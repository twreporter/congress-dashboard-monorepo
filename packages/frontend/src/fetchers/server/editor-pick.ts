import { keystoneFetch } from '@/app/api/_graphql/keystone'
// constants
import { EDITOR_SELECT_TYPE } from '@/constants/editor-pick'
// type
import type { EditorSelect } from '@/types/editor-pick'

/* fetchEditorSelecteds
 *   fetch editor selecteds order by `order` asc
 */

type EditorSelectFromRes = {
  labelField: string
  order: number
  topic?: {
    slug: string
  }
  legislator?: {
    slug: string
  }
}

const fetchEditorSelecteds = async (): Promise<EditorSelect[]> => {
  const query = `
    query GetSelectedsWithOrder($orderBy: [SelectedOrderByInput!]!) {
      selecteds(orderBy: $orderBy) {
        labelField
        order
        legislator {
          slug
        }
        topic {
          slug
        }
      }
    }
  `
  const variables = {
    orderBy: [{ order: 'asc' }],
  }

  try {
    const data = await keystoneFetch<{ selecteds: EditorSelectFromRes[] }>(
      JSON.stringify({ query, variables }),
      false
    )
    const selecteds = data.data?.selecteds || []
    return selecteds.map((select) => {
      const type = select.legislator
        ? EDITOR_SELECT_TYPE.legislator
        : EDITOR_SELECT_TYPE.topic
      const slug = select.legislator?.slug || select.topic?.slug || ''

      return {
        label: select.labelField,
        order: select.order,
        slug,
        type,
      }
    })
  } catch (err) {
    throw new Error(`Failed to fetch editor selecteds. err: ${err}`)
  }
}

export default fetchEditorSelecteds
