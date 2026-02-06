#!/usr/bin/env node

// @ts-ignore @twreporter/errors lacks of type definition
import errors from '@twreporter/errors'
import { Command } from 'commander'
import {
  topicIterator,
  legislatorIterator,
  speechIterator,
  councilorIterator,
  councilTopicIterator,
  councilBillIterator,
} from './graphql'
import {
  transferLegislatorModelToRecord,
  transferTopicModelToRecord,
  transferSpeechModelToRecord,
  transferCouncilorModelToRecord,
  transferCouncilTopicModelToRecord,
  transferCouncilBillModelToRecord,
} from './transfer'
import {
  uploadTopics,
  uploadLegislators,
  uploadSpeeches,
  uploadCouncilors,
  uploadCouncilTopics,
  uploadCouncilBills,
} from './algolia'
import { dryrunState } from './state/dryrun'
import { councilNames, isValidCouncilName } from './council-config'

const programName = 'lawmaker'

const program = new Command()

const isDevMode = process.argv[1]?.includes('src/index.ts')

// Legislative Yuan environment variables
const defaultMeetingTerm = '11'
const defaultSessionTerm = 'all'
const envMeetingTerm = process.env.LAWMAKER_MEETING_TERM?.trim()
const envSessionTerm = process.env.LAWMAKER_SESSION_TERM?.trim()
const envTopics = process.env.LAWMAKER_TOPICS?.trim()
const envLegislators = process.env.LAWMAKER_LEGISLATORS?.trim()
const envSpeeches = process.env.LAWMAKER_SPEECHES?.trim()

// Council environment variables
const envCouncilors = process.env.LAWMAKER_COUNCILORS?.trim()
const envCouncilTopics = process.env.LAWMAKER_COUNCIL_TOPICS?.trim()
const envCouncilBills = process.env.LAWMAKER_COUNCIL_BILLS?.trim()
const envCouncilName = process.env.LAWMAKER_COUNCIL_NAME?.trim()

// Common environment variables
const envDryrun = process.env.LAWMAKER_DRYRUN?.trim()

const defaultTopics = envTopics === 'true'
const defaultLegislators = envLegislators === 'true'
const defaultSpeeches = envSpeeches === 'true'
const defaultCouncilors = envCouncilors === 'true'
const defaultCouncilTopics = envCouncilTopics === 'true'
const defaultCouncilBills = envCouncilBills === 'true'
const defaultDryrun = envDryrun !== 'false'

program
  .name(isDevMode ? 'dev' : programName)
  .description('CLI to feed data into Algolia indices')

const feedAlgolia = program
  .command('feed-algolia')
  .description('Feed legislative yuan or city council data into Algolia')

feedAlgolia
  .command('legislative-yuan')
  .description('Feed legislative yuan data (topics, legislators, speeches)')
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
        'Error to execute feed-algolia legislative-yuan command',
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

feedAlgolia
  .command('council')
  .description('Feed city council data (councilors, topics, bills)')
  .option(
    '--council-name <name>',
    `Specific council to update (${councilNames.join(
      ', '
    )}). Omit to update all six major cities`,
    envCouncilName
  )
  .option('--councilor', 'Only update councilor records', defaultCouncilors)
  .option(
    '--council-topic',
    'Only update council topic records',
    defaultCouncilTopics
  )
  .option(
    '--council-bill',
    'Only update council bill records',
    defaultCouncilBills
  )
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
        !options.councilor && !options.councilTopic && !options.councilBill

      // Validate council name if provided
      if (options.councilName && !isValidCouncilName(options.councilName)) {
        console.log(
          `\n❌ Invalid council name: ${
            options.councilName
          }. Must be one of: ${councilNames.join(', ')}`
        )
        return
      }

      const targetCouncils = options.councilName
        ? [options.councilName]
        : [...councilNames]

      console.log(
        `\n🏛️  Processing ${
          targetCouncils.length === 6
            ? 'all six major city'
            : targetCouncils.join(', ')
        } council(s)`
      )

      for (const councilName of targetCouncils) {
        console.log(`\n📍 Processing council: ${councilName}`)

        if (options.councilor || executeAll) {
          console.log(`\n🔎 Fetching councilors for ${councilName}`)
          for await (const councilorModels of councilorIterator(councilName)) {
            if (councilorModels.length > 0) {
              const councilorRecords =
                transferCouncilorModelToRecord(councilorModels)
              console.log('Upload councilor records to Algolia.')
              await uploadCouncilors(councilorRecords)
            }
          }
        }

        if (options.councilTopic || executeAll) {
          console.log(`\n🔎 Fetching council topics for ${councilName}`)
          for await (const topicModels of councilTopicIterator(councilName)) {
            if (topicModels.length > 0) {
              const topicRecords =
                transferCouncilTopicModelToRecord(topicModels)
              console.log('Upload council topic records to Algolia.')
              await uploadCouncilTopics(topicRecords)
            }
          }
        }

        if (options.councilBill || executeAll) {
          console.log(`\n🔎 Fetching council bills for ${councilName}`)
          for await (const billModels of councilBillIterator(councilName)) {
            if (billModels.length > 0) {
              const billRecords = transferCouncilBillModelToRecord(billModels)
              console.log('Upload council bill records to Algolia.')
              await uploadCouncilBills(billRecords)
            }
          }
        }
      }

      console.log('\n✅ Council data processing completed')
    } catch (_err) {
      const err = errors.helpers.wrap(
        _err,
        'Command Error',
        'Error to execute feed-algolia council command',
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
