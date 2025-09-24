import keystoneFetch from '@/app/api/_graphql/keystone'

type LegislativeMeetingFromRes = {
  id: number
  term: number
}

const fetchLegislativeMeetings = async () => {
  const query = `
    query LegislativeMeetingsOrderDesc {
      legislativeMeetings(orderBy: [{ term: desc }]) {
        id
        term
      }
    }
  `
  const data = await keystoneFetch<{
    legislativeMeetings: LegislativeMeetingFromRes[]
  }>(JSON.stringify({ query }), false)
  return data?.data?.legislativeMeetings || []
}

export default fetchLegislativeMeetings
