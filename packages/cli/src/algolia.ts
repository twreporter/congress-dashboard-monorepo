import { algoliasearch } from 'algoliasearch'
import * as dotenv from 'dotenv'
dotenv.config()

if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_WRITE_KEY) {
  throw new Error('ALGOLIA_APP_ID or ALGOLIA_WRITE_KEY is not set in .env')
}

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_WRITE_KEY
)

export type SpeechRecord = {
  slug: string
  title: string
  date: string
  term?: number
  session?: number
  summary?: string
  legislatorName?: string
}

export type TopicRecord = {
  name: string
  slug: string
  term: number
  session: number
  desc: string
  lastSpeechAt: string
  relatedMessageCount: number
  objectID: string
}

export type LegislatorRecord = {
  slug: string
  name: string
  term: number
  lastSpeechAt: string
  desc: string
  objectID: string
  imgSrc: string
  partyImgSrc: string
}

export async function uploadSpeeches(records: SpeechRecord[], dryrun = false) {
  if (dryrun) {
    console.log(
      '[dryrun] speech records to upload: ',
      JSON.stringify(records, null, 2)
    )
  } else {
    const result = await client.saveObjects({
      indexName: 'speech',
      objects: records,
    })
    console.log(`✅ Uploaded ${records.length} speech records to Algolia`)
    return result
  }
}

export async function uploadTopics(records: TopicRecord[], dryrun = false) {
  if (dryrun) {
    console.log(
      '[dryrun] topic records to upload: ',
      JSON.stringify(records, null, 2)
    )
  } else {
    const result = await client.saveObjects({
      indexName: 'topic',
      objects: records,
    })
    console.log(`✅ Uploaded ${records.length} topic records to Algolia`)
    return result
  }
}

export async function uploadLegislators(
  records: LegislatorRecord[],
  dryrun = false
) {
  if (dryrun) {
    console.log(
      '[dryrun] legislator records to upload: ',
      JSON.stringify(records, null, 2)
    )
  } else {
    const result = await client.saveObjects({
      indexName: 'legislator',
      objects: records,
    })
    console.log(`✅ Uploaded ${records.length} legislator records to Algolia`)
    return result
  }
}
