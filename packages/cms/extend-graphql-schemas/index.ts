import type { GraphQLSchema } from 'graphql'
import { mergeSchemas } from '@graphql-tools/schema'
// custom sql
import {
  recentSpeechTopicStatsTypeDefs,
  recentSpeechTopicStatsResolvers,
  historySpeechTopicStatsTypeDefs,
  historySpeechTopicStatsResolvers,
} from './recent-speech-topic-stats'
import {
  topNTopicsOfLegislatorsTypeDefs,
  topNTopicsOfLegislatorsResolver,
} from './top-n-topics-of-legislators'
import {
  topicsOrderBySpeechCountTypeDefs,
  topicsOrderBySpeechCountResolver,
} from './topics-order-by-speech-count'

const extendGraphqlSchema = (baseSchema: GraphQLSchema) => {
  return mergeSchemas({
    schemas: [baseSchema],
    typeDefs: [
      recentSpeechTopicStatsTypeDefs,
      historySpeechTopicStatsTypeDefs,
      topNTopicsOfLegislatorsTypeDefs,
      topicsOrderBySpeechCountTypeDefs,
    ],
    resolvers: [
      recentSpeechTopicStatsResolvers,
      historySpeechTopicStatsResolvers,
      topNTopicsOfLegislatorsResolver,
      topicsOrderBySpeechCountResolver,
    ],
  })
}

export default extendGraphqlSchema
