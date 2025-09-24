import keystoneFetch from '@/app/api/_graphql/keystone'

type committeeDataFromRes = {
  slug: string
  name: string
  type: 'standing' | 'ad-hoc'
}

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
  const data = await keystoneFetch<{ committees: committeeDataFromRes[] }>(
    JSON.stringify({ query }),
    false
  )
  return data?.data?.committees || []
}

export default fetchCommittee
