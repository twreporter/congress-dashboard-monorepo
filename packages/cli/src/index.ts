#!/usr/bin/env node

// @ts-ignore @twreporter/errors lacks of type definition
import errors from '@twreporter/errors'
import { Command } from 'commander'
import { topicIterator, legislatorIterator, speechIterator } from './graphql'
import {
  transferLegislatorModelToRecord,
  transferTopicModelToRecord,
  transferSpeechModelToRecord,
} from './transfer'
import { uploadTopics, uploadLegislators, uploadSpeeches } from './algolia'
import { dryrunState } from './state/dryrun'

const programName = 'lawmaker'
const commandName = 'feed-algolia'

const program = new Command()

const isDevMode = process.argv[1]?.includes('src/index.ts')

const defaultMeetingTerm = '11'
const defaultSessionTerm = 'all'
const envMeetingTerm = process.env.LAWMAKER_MEETING_TERM?.trim()
const envSessionTerm = process.env.LAWMAKER_SESSION_TERM?.trim()
const envTopics = process.env.LAWMAKER_TOPICS?.trim()
const envLegislators = process.env.LAWMAKER_LEGISLATORS?.trim()
const envSpeeches = process.env.LAWMAKER_SPEECHES?.trim()
const envDryrun = process.env.LAWMAKER_DRYRUN?.trim()

const defaultTopics = envTopics === 'true'
const defaultLegislators = envLegislators === 'true'
const defaultSpeeches = envSpeeches === 'true'
const defaultDryrun = envDryrun !== 'false'

program
  .name(isDevMode ? 'dev' : programName)
  .description('CLI to feed data into Algolia indices')

program
  .command(commandName)
  .description(
    'Feed topics, speeches and legislators records by a given meeting term into Algolia search engine'
  )
  .option(
    '--meeting-term <term>',
    'Legislative meeting term',
    envMeetingTerm || defaultMeetingTerm
  )
  .option(
    '--session-term <term>',
    'Legislative meeting session term. Only for updating speeches',
    envSessionTerm || defaultSessionTerm
  )
  .option('--topics', 'Only update topic records', defaultTopics)
  .option('--legislators', 'Only update legislator records', defaultLegislators)
  .option('--speeches', 'Only update speech records', defaultSpeeches)
  .option(
    '--dryrun',
    'Enable dry-run mode (do not write to Algolia)',
    defaultDryrun
  )
  .option('--no-dryrun', 'Disable dry-run mode (actually write to Algolia)')
  .action(async (options) => {
    try {
      if (options.dryrun) {
        dryrunState.enable()
      } else {
        dryrunState.disable()
      }

      const executeAll =
        !options.topics && !options.legislators && !options.speeches

      const meetingTerm = Number(options.meetingTerm)

      if (isNaN(meetingTerm)) {
        console.log(
          `\n🔎 Program exits due to --meeting-term ${options.meetingTerm} is not a number`
        )
        return
      }

      const sessionTerm =
        options.sessionTerm !== 'all' ? Number(options.sessionTerm) : undefined

      if (options.topics || executeAll) {
        console.log(`\n🔎 Fetching topics in the meeting term ${meetingTerm}`)
        for await (const topicModels of topicIterator(meetingTerm)) {
          if (topicModels.length > 0) {
            const topicRecords = transferTopicModelToRecord(topicModels)
            console.log('Upload topic records to Algolia.')
            await uploadTopics(topicRecords)
          }
        }
      }

      if (options.legislators || executeAll) {
        console.log(
          `\n🔎 Fetching legislatorYuanMembers in the meeting term ${meetingTerm}`
        )
        for await (const legislatorModels of legislatorIterator(meetingTerm)) {
          if (legislatorModels.length > 0) {
            const legislatorRecords =
              transferLegislatorModelToRecord(legislatorModels)
            console.log('Upload legislator records to Algolia.')
            await uploadLegislators(legislatorRecords)
          }
        }
      }

      if (options.speeches || executeAll) {
        console.log(
          `\n🔎 Fetching speeches in the meeting term ${meetingTerm} and session term ${options.sessionTerm}`
        )
        for await (const speechModels of speechIterator(
          meetingTerm,
          10,
          sessionTerm
        )) {
          if (speechModels.length > 0) {
            const speechRecords = transferSpeechModelToRecord(speechModels)
            console.log('Upload speech records to Algolia.')
            await uploadSpeeches(speechRecords)
          }
        }
      }
    } catch (_err) {
      const err = errors.helpers.wrap(
        _err,
        'Command Error',
        'Error to execute feed-algolia command',
        {
          options,
        }
      )
      console.log(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(
            err,
            {
              withStack: true,
              withPayload: true,
            },
            0,
            0
          ),
        })
      )
    }
  })

program.parse()
