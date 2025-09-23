import { liteClient as algoliasearch } from 'algoliasearch/lite'
import type { SearchMethodParams, LegacySearchMethodProps } from 'algoliasearch'

export function createAlgoliaSearchClient() {
  if (typeof window === 'undefined') {
    return null
  }

  const appID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
  const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY

  if (!appID || !searchKey) {
    console.warn('Missing Algolia credentials')
    return null
  }

  const client = algoliasearch(appID, searchKey)
  const originalSearch = client.search.bind(client)

  client.search = (requests: SearchMethodParams | LegacySearchMethodProps) => {
    const allEmpty =
      Array.isArray(requests) &&
      requests.length > 0 &&
      requests.every((r) => (r?.params?.query ?? '').trim().length === 0)

    if (allEmpty) {
      return Promise.resolve({
        results: requests.map(({ params }) => {
          const query = typeof params?.query === 'string' ? params.query : ''
          return {
            hits: [],
            nbHits: 0,
            page: 0,
            nbPages: 0,
            hitsPerPage: 0,
            processingTimeMS: 0,
            exhaustiveNbHits: true,
            query,
            params: '',
          }
        }),
      })
    }

    return originalSearch(requests)
  }

  return client
}
