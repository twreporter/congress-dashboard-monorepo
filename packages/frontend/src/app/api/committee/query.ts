import keystoneFetch from '@/app/api/_graphql/keystone'
// type
import type { Committee } from '@/types/committee'

const fetchCommittee = async () => {
  const query = `
    query Committees {
      committees {
        name
        slug
        type
      }
    }
  `
  const data = await keystoneFetch<{ committees: Committee[] }>(
    JSON.stringify({ query }),
    false
  )
  return data?.data?.committees || []
}

export default fetchCommittee
