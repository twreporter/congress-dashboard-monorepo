import keystoneFetch from '@/app/api/_graphql/keystone'
// type
import type { PartyData } from '@/types/party'

export const fetchParty = async () => {
  const query = `
    query GetAllParties {
      parties {
        id
        slug
        name
        imageLink
        image {
          imageFile {
            url
          }
        }
      }
    }
  `
  try {
    const data = await keystoneFetch<{ parties: PartyData[] }>(
      JSON.stringify({ query }),
      false
    )
    return data?.data?.parties
  } catch (err) {
    throw new Error(`Failed to fetch all parties, err: ${err}`)
  }
}

export default fetchParty
