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
  councilTopicsOrderByBillCountTypeDefs,
  councilTopicsOrderByBillCountResolver,
} from './council-topics-order-by-bill-count'
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
      councilTopicsOrderByBillCountTypeDefs,
      topNTopicsOfCouncilorsTypeDefs,
    ],
    resolvers: [
      topNTopicsOfLegislatorsResolver,
      topicsOrderBySpeechCountResolver,
      councilTopicsOrderByBillCountResolver,
      topNTopicsOfCouncilorsResolver,
    ],
  })
}

export default extendGraphqlSchema
