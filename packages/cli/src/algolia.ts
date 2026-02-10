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
  dateTs?: number
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
  slug: string // Unique identifier for the bill
  title: string // Bill title
  date: string // Formatted date (YYYY/MM/DD) in UTC+8
  dateTs?: number // Unix timestamp in milliseconds for Algolia ranking
  summary?: string // HTML-stripped summary text
  council: string // Display name (e.g., "台北市議會")
  councilSlug: string // English identifier for filtering/routing (e.g., "taipei")
  councilRank: number // Ranking order for Algolia custom ranking (1-6)
  meetingTerm: number // Council meeting term number
  councilor: string // First proposer name (e.g., "林亮君")
  councilorCount: number // Total number of proposers (e.g., 15)
  objectID: string // Format: ${slug}_${councilSlug}_${meetingTerm}
}

export type CouncilTopicRecord = {
  name: string // Topic title
  slug: string // Unique identifier for the topic
  desc: string // Formatted string of participating members (e.g., "林亮君(16)、王鴻薇(8)")
  lastSpeechAt: string // Formatted date (YYYY/MM/DD) in UTC+8 of latest bill
  lastSpeechAtTs?: number // Unix timestamp in milliseconds for Algolia ranking
  council: string // Display name (e.g., "台北市議會")
  councilSlug: string // English identifier for filtering/routing (e.g., "taipei")
  councilRank: number // Ranking order for Algolia custom ranking (1-6)
  meetingTerm: number // Council meeting term number
  billCount: number // Total number of bills in this topic
  objectID: string // Format: ${slug}_${councilSlug}_${meetingTerm}
}

export type CouncilorRecord = {
  slug: string // Councilor slug from Councilor entity
  name: string // Councilor full name
  council: string // Display name (e.g., "台北市議會")
  councilSlug: string // English identifier for filtering/routing (e.g., "taipei")
  councilRank: number // Ranking order for Algolia custom ranking (1-6)
  meetingTerm: number // Council meeting term number
  lastSpeechAt: string // Formatted date (YYYY/MM/DD) in UTC+8 of latest bill
  lastSpeechAtTs?: number // Unix timestamp in milliseconds for Algolia ranking
  desc: string // Formatted description with party, term, constituency info
  objectID: string // Format: ${slug}_${councilSlug}_${meetingTerm}
  imgSrc: string // Councilor profile image URL
  partyImgSrc: string // Party logo image URL
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
            objectID: r.objectID,
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
            objectID: r.objectID,
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
            objectID: r.objectID,
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
