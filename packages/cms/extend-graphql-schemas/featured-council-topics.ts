import type { TypedKeystoneContext } from '../types/context'
import { getFeaturedCouncilTopicsSql } from '../custom-sql/featuredCouncilTopics'

type FeaturedTopicRow = {
  topicId: number
  title: string
  slug: string
  speechCount: bigint
  billCount: bigint
  councilorCount: bigint
  id: number | null
  name: string | null
  councilorSlug: string | null
  imageLink: string | null
  imageId: string | null
  imageExtension: string | null
  count: bigint | null
}

type FeaturedTopic = {
  title: string
  slug: string
  speechCount: number
  billCount: number
  councilorCount: number
  councilors: {
    id: number
    name: string | null
    slug: string | null
    imageLink: string | null
    count: number
    image?: { imageFile: { url: string } }
  }[]
}

export const resolveFeaturedCouncilTopics = async (
  _root: unknown,
  { city }: { city: string },
  context: TypedKeystoneContext
): Promise<FeaturedTopic[]> => {
  const rows: FeaturedTopicRow[] = await context.prisma.$queryRaw(
    getFeaturedCouncilTopicsSql(city)
  )
  const topics = new Map<number, FeaturedTopic>()
  for (const row of rows) {
    let topic = topics.get(row.topicId)
    if (!topic) {
      topic = {
        title: row.title,
        slug: row.slug,
        speechCount: Number(row.speechCount),
        billCount: Number(row.billCount),
        councilorCount: Number(row.councilorCount),
        councilors: [],
      }
      topics.set(row.topicId, topic)
    }
    if (row.id !== null) {
      topic.councilors.push({
        id: row.id,
        name: row.name,
        slug: row.councilorSlug,
        imageLink: row.imageLink,
        count: Number(row.count),
        image:
          row.imageId && row.imageExtension
            ? {
                imageFile: {
                  url: `/images/${row.imageId}.${row.imageExtension}`,
                },
              }
            : undefined,
      })
    }
  }
  return Array.from(topics.values())
}
