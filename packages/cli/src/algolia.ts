import { algoliasearch } from 'algoliasearch'
import { dryrunState } from './state/dryrun'
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
  meetingTerm: number
  sessionTerm?: number
  summary?: string
  legislatorName?: string
}

export type TopicRecord = {
  name: string
  slug: string
  meetingTerm: number
  desc: string
  lastSpeechAt: string
  relatedMessageCount: number
  objectID: string
}

export type LegislatorRecord = {
  slug: string
  name: string
  meetingTerm: number
  lastSpeechAt: string
  desc: string
  objectID: string
  imgSrc: string
  partyImgSrc: string
}

export type CouncilBillRecord = {
  slug: string
  title: string
  date: string
  summary?: string
  council: string
  councilor: string
  objectID: string
}

export type CouncilTopicRecord = {
  name: string
  slug: string
  desc: string
  lastSpeechAt: string
  council: string
  councilSlug: string
  meetingTerm?: number
  billCount: number
  objectID: string
}

export type CouncilorRecord = {
  slug: string
  name: string
  council: string
  councilSlug: string
  meetingTerm?: number
  lastSpeechAt: string
  desc: string
  objectID: string
  imgSrc: string
  partyImgSrc: string
}

export async function uploadSpeeches(records: SpeechRecord[]) {
  if (dryrunState.isEnabled()) {
    console.log(
      '[dryrun] speech records to upload: ',
      JSON.stringify(records, null, 2)
    )
  } else {
    console.log(
      'Try to upload the following speech records: ',
      JSON.stringify(
        records.map((r) => {
          return {
            slug: r.slug,
            meetingTerm: r.meetingTerm,
            sessionTerm: r.sessionTerm,
          }
        })
      )
    )
    const result = await client.saveObjects({
      indexName: 'speech',
      objects: records,
    })
    console.log(`✅ Uploaded ${records.length} speech records to Algolia`)
    return result
  }
}

export async function uploadTopics(records: TopicRecord[]) {
  if (dryrunState.isEnabled()) {
    console.log(
      '[dryrun] topic records to upload: ',
      JSON.stringify(records, null, 2)
    )
  } else {
    console.log(
      'Try to upload the following topic records: ',
      JSON.stringify(
        records.map((r) => {
          return {
            slug: r.slug,
            meetingTerm: r.meetingTerm,
          }
        })
      )
    )
    const result = await client.saveObjects({
      indexName: 'topic',
      objects: records,
    })
    console.log(`✅ Uploaded ${records.length} topic records to Algolia`)
    return result
  }
}

export async function uploadLegislators(records: LegislatorRecord[]) {
  if (dryrunState.isEnabled()) {
    console.log(
      '[dryrun] legislator records to upload: ',
      JSON.stringify(records, null, 2)
    )
  } else {
    console.log(
      'Try to upload the following legislator records: ',
      JSON.stringify(
        records.map((r) => {
          return {
            slug: r.slug,
            meetingTerm: r.meetingTerm,
          }
        })
      )
    )
    const result = await client.saveObjects({
      indexName: 'legislator',
      objects: records,
    })
    console.log(`✅ Uploaded ${records.length} legislator records to Algolia`)
    return result
  }
}

export async function uploadCouncilors(records: CouncilorRecord[]) {
  if (dryrunState.isEnabled()) {
    console.log(
      '[dryrun] councilor records to upload: ',
      JSON.stringify(records, null, 2)
    )
  } else {
    console.log(
      'Try to upload the following councilor records: ',
      JSON.stringify(
        records.map((r) => {
          return {
            slug: r.slug,
            council: r.council,
          }
        })
      )
    )
    const result = await client.saveObjects({
      indexName: 'councilor',
      objects: records,
    })
    console.log(`✅ Uploaded ${records.length} councilor records to Algolia`)
    return result
  }
}

export async function uploadCouncilTopics(records: CouncilTopicRecord[]) {
  if (dryrunState.isEnabled()) {
    console.log(
      '[dryrun] council topic records to upload: ',
      JSON.stringify(records, null, 2)
    )
  } else {
    console.log(
      'Try to upload the following council topic records: ',
      JSON.stringify(
        records.map((r) => {
          return {
            slug: r.slug,
            council: r.council,
          }
        })
      )
    )
    const result = await client.saveObjects({
      indexName: 'council-topic',
      objects: records,
    })
    console.log(
      `✅ Uploaded ${records.length} council topic records to Algolia`
    )
    return result
  }
}

export async function uploadCouncilBills(records: CouncilBillRecord[]) {
  if (dryrunState.isEnabled()) {
    console.log(
      '[dryrun] council bill records to upload: ',
      JSON.stringify(records, null, 2)
    )
  } else {
    console.log(
      'Try to upload the following council bill records: ',
      JSON.stringify(
        records.map((r) => {
          return {
            slug: r.slug,
            council: r.council,
          }
        })
      )
    )
    const result = await client.saveObjects({
      indexName: 'council-bill',
      objects: records,
    })
    console.log(`✅ Uploaded ${records.length} council bill records to Algolia`)
    return result
  }
}
