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
import {
  councilTopicsOrderByWorkTypeDefs,
  councilTopicsOrderByWorkResolver,
} from './council-topics-order-by-work'
import {
  topNTopicsOfCouncilorsTypeDefs,
  topNTopicsOfCouncilorsResolver,
} from './top-n-topics-of-councilors'

const extendGraphqlSchema = (baseSchema: GraphQLSchema) => {
  return mergeSchemas({
    schemas: [baseSchema],
    typeDefs: [
      topNTopicsOfLegislatorsTypeDefs,
      topicsOrderBySpeechCountTypeDefs,
      councilTopicsOrderByWorkTypeDefs,
      topNTopicsOfCouncilorsTypeDefs,
    ],
    resolvers: [
      topNTopicsOfLegislatorsResolver,
      topicsOrderBySpeechCountResolver,
      councilTopicsOrderByWorkResolver,
      topNTopicsOfCouncilorsResolver,
    ],
  })
}

export default extendGraphqlSchema
