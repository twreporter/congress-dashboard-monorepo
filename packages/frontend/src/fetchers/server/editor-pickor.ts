import { keystoneFetch } from '@/app/api/_graphql/keystone'

/* fetchEditorSelecteds
 *   fetch editor selecteds order by `order` asc
 */

export enum EditorSelectType {
  Legislator,
  Topic,
}
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
export type EditorSelect = {
  label: string
  order: number
  slug: string
  type: EditorSelectType
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
        ? EditorSelectType.Legislator
        : EditorSelectType.Topic
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
