import { relationship } from '@keystone-6/core/fields'

type RelationshipConfig = Parameters<typeof relationship>[0]

/**
 * A Keystone relationship that uses the native relationship UI with an
 * opt-in height limit for its selected values.
 */
export const scrollableRelationship = (config: RelationshipConfig) => {
  const relationshipField = relationship(config)

  return (...args: Parameters<typeof relationshipField>) => ({
    ...relationshipField(...args),
    views: './lists/views/scrollable-relationship',
  })
}
