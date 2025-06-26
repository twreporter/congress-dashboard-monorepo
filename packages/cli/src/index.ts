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

const programName = 'lawmaker'
const commandName = 'feed-algolia'

const program = new Command()

const isDevMode = process.argv[1]?.includes('src/index.ts')

program
  .name(isDevMode ? 'dev' : programName)
  .description('CLI to feed data into Algolia indices')

program
  .command(`${commandName} [updatedAfter]`)
  .description(
    'Feed Algolia search by topics, speeches and lesgislators records after a given date'
  )
  .option('--yesterday', "Use yesterday's date as updatedAfter if not provided")
  .option('--topics', 'Only update topic records')
  .option('--legislators', 'Only update legislator records')
  .option('--speeches', 'Only update speech records')
  .option('--dryrun', 'Enable dry-run mode (do not write to Algolia)')
  .option('--no-dryrun', 'Disable dry-run mode (actually write to Algolia)')
  .action(async (_updatedAfter, options) => {
    try {
      let updatedAfter = _updatedAfter
      if (!updatedAfter && options.yesterday) {
        const date = new Date()
        date.setDate(date.getDate() - 1)
        updatedAfter = date.toISOString().split('T')[0]
      }

      if (!updatedAfter) {
        console.log(
          `No arguments provided. Try 'yarn lawmaker ${commandName} --help' or 'yarn dev ${commandName} --help' (for development) for usage.`
        )
        return
      }

      const dryrun = options.dryrun ?? true

      const executeAll =
        !options.topics && !options.legislators && !options.speeches

      if (options.topics || executeAll) {
        console.log(
          `\n🔎 Fetching topics with speeches updated after ${updatedAfter}`
        )
        for await (const topicModels of topicIterator(updatedAfter)) {
          if (topicModels.length > 0) {
            const topicRecords = transferTopicModelToRecord(topicModels)
            console.log('Upload topic records to Algolia.')
            await uploadTopics(topicRecords, dryrun)
          }
        }
      }

      if (options.legislators || executeAll) {
        console.log(
          `\n🔎 Fetching legislatorYuanMembers with speeches updated after ${updatedAfter}`
        )
        for await (const legislatorModels of legislatorIterator(updatedAfter)) {
          if (legislatorModels.length > 0) {
            const legislatorRecords =
              transferLegislatorModelToRecord(legislatorModels)
            console.log('Upload legislator records to Algolia.')
            await uploadLegislators(legislatorRecords, dryrun)
          }
        }
      }

      if (options.speeches || executeAll) {
        console.log(`\n🔎 Fetching speeches updated after ${updatedAfter}`)
        for await (const speechModels of speechIterator(updatedAfter)) {
          if (speechModels.length > 0) {
            const speechRecords = transferSpeechModelToRecord(speechModels)
            console.log('Upload speech records to Algolia.')
            await uploadSpeeches(speechRecords, dryrun)
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
          updatedAfter: _updatedAfter,
        }
      )
      console.log(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(err, {
            withStack: true,
            withPayload: true,
          }),
        })
      )
    }
  })

program.parse()
