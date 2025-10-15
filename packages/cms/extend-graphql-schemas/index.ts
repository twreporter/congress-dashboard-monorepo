import type { GraphQLSchema } from 'graphql'
import { mergeSchemas } from '@graphql-tools/schema'
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
      topNTopicsOfLegislatorsTypeDefs,
      topicsOrderBySpeechCountTypeDefs,
    ],
    resolvers: [
      topNTopicsOfLegislatorsResolver,
      topicsOrderBySpeechCountResolver,
    ],
  })
}

export default extendGraphqlSchema
