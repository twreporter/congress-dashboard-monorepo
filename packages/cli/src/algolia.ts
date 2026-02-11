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

const ALGOLIA_INDEX_NAMES = {
  speech: 'speech',
  topic: 'topic',
  legislator: 'legislator',
  councilor: 'councilor',
  councilTopic: 'council-topic',
  councilBill: 'council-bill',
} as const

type AlgoliaIndexName =
  (typeof ALGOLIA_INDEX_NAMES)[keyof typeof ALGOLIA_INDEX_NAMES]

type RecordType =
  | 'speech'
  | 'topic'
  | 'legislator'
  | 'councilor'
  | 'council topic'
  | 'council bill'

/**
 * Generic upload function for Algolia records.
 * Handles dryrun mode and provides consistent logging.
 */
async function uploadRecords<T extends Record<string, any>>(
  indexName: AlgoliaIndexName,
  records: T[],
  recordType: RecordType,
  getLogFields?: (record: T) => Record<string, any>
) {
  if (dryrunState.isEnabled()) {
    console.log(
      `[dryrun] ${recordType} records to upload: `,
      JSON.stringify(records, null, 2)
    )
  } else {
    console.log(
      `Try to upload the following ${recordType} records: `,
      JSON.stringify(
        getLogFields
          ? records.map(getLogFields)
          : records.map((r) => ({ objectID: r.objectID }))
      )
    )
    const result = await client.saveObjects({
      indexName,
      objects: records,
    })
    console.log(
      `✅ Uploaded ${records.length} ${recordType} records to Algolia`
    )
    return result
  }
}

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
  return uploadRecords(ALGOLIA_INDEX_NAMES.speech, records, 'speech', (r) => ({
    slug: r.slug,
    meetingTerm: r.meetingTerm,
    sessionTerm: r.sessionTerm,
  }))
}

export async function uploadTopics(records: TopicRecord[]) {
  return uploadRecords(ALGOLIA_INDEX_NAMES.topic, records, 'topic', (r) => ({
    slug: r.slug,
    meetingTerm: r.meetingTerm,
  }))
}

export async function uploadLegislators(records: LegislatorRecord[]) {
  return uploadRecords(
    ALGOLIA_INDEX_NAMES.legislator,
    records,
    'legislator',
    (r) => ({
      slug: r.slug,
      meetingTerm: r.meetingTerm,
    })
  )
}

export async function uploadCouncilors(records: CouncilorRecord[]) {
  return uploadRecords(ALGOLIA_INDEX_NAMES.councilor, records, 'councilor')
}

export async function uploadCouncilTopics(records: CouncilTopicRecord[]) {
  return uploadRecords(
    ALGOLIA_INDEX_NAMES.councilTopic,
    records,
    'council topic'
  )
}

export async function uploadCouncilBills(records: CouncilBillRecord[]) {
  return uploadRecords(ALGOLIA_INDEX_NAMES.councilBill, records, 'council bill')
}
