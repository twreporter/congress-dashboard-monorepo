import { Prisma } from '@prisma/client'

type Params = {
  meetingId: number
  partyIds?: number[]
  take?: number
  skip?: number
  topicIds?: number[]
}

/**
 * Get council topics ordered by bill count (descending)
 * For council, we use bill count instead of speech count since CouncilBill is the unit
 */
export const getCouncilTopicsSql = ({
  meetingId,
  partyIds = [],
  take,
  skip,
}: Params) => {
  const hasParty = partyIds.length > 0
  if (!hasParty) {
    return Prisma.sql`
      SELECT t.id, t.title, t.slug, COUNT(DISTINCT b.id) as billCount, COUNT(DISTINCT cm.councilor) as councilorCount
      FROM CouncilTopic t
      JOIN _CouncilBill_topic bt ON t.id = bt.B
      JOIN CouncilBill b ON bt.A = b.id
      JOIN _CouncilBill_councilMember bcm ON b.id = bcm.A
      JOIN CouncilMember cm ON bcm.B = cm.id
      WHERE b.councilMeeting = ${meetingId}
      GROUP BY t.id
      ORDER BY billCount DESC
      LIMIT ${take} OFFSET ${skip}
    `
  } else {
    return Prisma.sql`
      SELECT t.id, t.title, t.slug, COUNT(DISTINCT b.id) as billCount, COUNT(DISTINCT cm.councilor) as councilorCount
      FROM CouncilTopic t
      JOIN _CouncilBill_topic bt ON t.id = bt.B
      JOIN CouncilBill b ON bt.A = b.id
      JOIN _CouncilBill_councilMember bcm ON b.id = bcm.A
      JOIN CouncilMember cm ON bcm.B = cm.id
      WHERE b.councilMeeting = ${meetingId} AND cm.party IN (${Prisma.join(
      partyIds
    )})
      GROUP BY t.id
      ORDER BY billCount DESC
      LIMIT ${take} OFFSET ${skip}
    `
  }
}

/**
 * Get top 5 councilors for each topic
 * Returns councilors with the most bills for each topic
 */
export const getTop5CouncilorsSql = ({
  meetingId,
  partyIds = [],
  topicIds = [],
}: Params) => {
  const hasParty = partyIds.length > 0
  if (!hasParty) {
    return Prisma.sql`
      WITH councilor_counts AS (
        SELECT bt.B as topic_id, cm.councilor as councilor_id, COUNT(DISTINCT b.id) as bill_count
        FROM _CouncilBill_topic bt
        JOIN CouncilBill b ON bt.A = b.id
        JOIN _CouncilBill_councilMember bcm ON b.id = bcm.A
        JOIN CouncilMember cm ON bcm.B = cm.id
        WHERE bt.B IN (${Prisma.join(
          topicIds
        )}) AND b.councilMeeting = ${meetingId}
        GROUP BY bt.B, cm.councilor
      ),
      Rank_c AS (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY topic_id ORDER BY bill_count DESC) AS rnk
        FROM councilor_counts
      )
      SELECT rc.topic_id as topicId, rc.bill_count as count, c.id, c.name, cm.party, c.slug, c.imageLink, p.imageFile_id as imageId, p.imageFile_extension as imageExtension
      FROM Rank_c rc
      JOIN Councilor c ON c.id = rc.councilor_id
      LEFT JOIN CouncilMember cm ON cm.councilor = c.id AND cm.councilMeeting = ${meetingId}
      LEFT JOIN Photo p ON c.image = p.id
      WHERE rc.rnk <= 5
      ORDER BY rc.topic_id, rc.bill_count DESC
    `
  } else {
    return Prisma.sql`
      WITH councilor_counts AS (
        SELECT bt.B as topic_id, cm.councilor as councilor_id, COUNT(DISTINCT b.id) as bill_count
        FROM _CouncilBill_topic bt
        JOIN CouncilBill b ON bt.A = b.id
        JOIN _CouncilBill_councilMember bcm ON b.id = bcm.A
        JOIN CouncilMember cm ON bcm.B = cm.id
        WHERE bt.B IN (${Prisma.join(
          topicIds
        )}) AND b.councilMeeting = ${meetingId} AND cm.party IN (${Prisma.join(
      partyIds
    )})
        GROUP BY bt.B, cm.councilor
      ),
      Rank_c AS (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY topic_id ORDER BY bill_count DESC) AS rnk
        FROM councilor_counts
      )
      SELECT rc.topic_id as topicId, rc.bill_count as count, c.id, c.name, cm.party, c.slug, c.imageLink, p.imageFile_id as imageId, p.imageFile_extension as imageExtension
      FROM Rank_c rc
      JOIN Councilor c ON c.id = rc.councilor_id
      LEFT JOIN CouncilMember cm ON cm.councilor = c.id AND cm.councilMeeting = ${meetingId}
      LEFT JOIN Photo p ON c.image = p.id
      WHERE rc.rnk <= 5
      ORDER BY rc.topic_id, rc.bill_count DESC
    `
  }
}
