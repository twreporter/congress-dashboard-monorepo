import { Prisma } from '@prisma/client'

type Params = {
  meetingId: number
  partyIds?: number[]
  take?: number
  skip?: number
  topicIds?: number[]
}

/**
 * Get council topics ordered by speech count, then bill count (both
 * descending), with topic id as a deterministic pagination tie-breaker.
 */
export const getCouncilTopicsSql = ({
  meetingId,
  partyIds = [],
  take,
  skip,
}: Params) => {
  const speechWhereClauses = [Prisma.sql`s.councilMeeting = ${meetingId}`]
  const billWhereClauses = [Prisma.sql`b.councilMeeting = ${meetingId}`]
  if (partyIds.length > 0) {
    const partyClause = Prisma.sql`cm.party IN (${Prisma.join(partyIds)})`
    speechWhereClauses.push(partyClause)
    billWhereClauses.push(partyClause)
  }

  return Prisma.sql`
    WITH work AS (
      SELECT st.B AS topic_id, s.id AS speech_id, NULL AS bill_id, cm.councilor AS councilor_id
      FROM _CouncilSpeech_topic st
      JOIN CouncilSpeech s ON st.A = s.id
      JOIN _CouncilMember_speech cms ON cms.B = s.id
      JOIN CouncilMember cm ON cms.A = cm.id
      WHERE ${Prisma.join(speechWhereClauses, ' AND ')}

      UNION ALL

      SELECT bt.B AS topic_id, NULL AS speech_id, b.id AS bill_id, cm.councilor AS councilor_id
      FROM _CouncilBill_topic bt
      JOIN CouncilBill b ON bt.A = b.id
      JOIN _CouncilBill_councilMember bcm ON b.id = bcm.A
      JOIN CouncilMember cm ON bcm.B = cm.id
      WHERE ${Prisma.join(billWhereClauses, ' AND ')}
    )
    SELECT
      t.id,
      t.title,
      t.slug,
      COUNT(DISTINCT a.speech_id) AS speechCount,
      COUNT(DISTINCT a.bill_id) AS billCount,
      COUNT(DISTINCT a.councilor_id) AS councilorCount
    FROM work a
    JOIN CouncilTopic t ON t.id = a.topic_id
    GROUP BY t.id
    ORDER BY speechCount DESC, billCount DESC, t.id ASC
    LIMIT ${take} OFFSET ${skip}
  `
}

/**
 * Get the topics related to one councilor in a meeting. Counts and ordering are
 * calculated in SQL so the frontend does not need every nested speech, bill,
 * and council-member record.
 */
export const getCouncilorTopicsSql = ({
  meetingId,
  councilorSlug,
}: {
  meetingId: number
  councilorSlug: string
}) => Prisma.sql`
  WITH work AS (
    SELECT st.B AS topic_id, s.id AS speech_id, NULL AS bill_id, cm.councilor AS councilor_id, c.slug AS councilor_slug
    FROM _CouncilSpeech_topic st
    JOIN CouncilSpeech s ON st.A = s.id
    JOIN _CouncilMember_speech cms ON cms.B = s.id
    JOIN CouncilMember cm ON cms.A = cm.id
    JOIN Councilor c ON c.id = cm.councilor
    WHERE s.councilMeeting = ${meetingId}

    UNION ALL

    SELECT bt.B AS topic_id, NULL AS speech_id, b.id AS bill_id, cm.councilor AS councilor_id, c.slug AS councilor_slug
    FROM _CouncilBill_topic bt
    JOIN CouncilBill b ON bt.A = b.id
    JOIN _CouncilBill_councilMember bcm ON b.id = bcm.A
    JOIN CouncilMember cm ON bcm.B = cm.id
    JOIN Councilor c ON c.id = cm.councilor
    WHERE b.councilMeeting = ${meetingId}
  )
  SELECT
    t.title,
    t.slug,
    t.type,
    COUNT(DISTINCT CASE WHEN w.councilor_slug = ${councilorSlug} THEN w.speech_id END) AS speechCount,
    COUNT(DISTINCT CASE WHEN w.councilor_slug = ${councilorSlug} THEN w.bill_id END) AS billCount,
    COUNT(DISTINCT w.councilor_id) AS councilorCount
  FROM work w
  JOIN CouncilTopic t ON t.id = w.topic_id
  GROUP BY t.id
  HAVING speechCount > 0 OR billCount > 0
  ORDER BY speechCount DESC, billCount DESC, councilorCount DESC, t.id ASC
`

/**
 * Get top 5 councilors for each topic
 * Returns councilors ordered by speech count, then bill count, for each topic.
 */
export const getTop5CouncilorsSql = ({
  meetingId,
  partyIds = [],
  topicIds = [],
}: Params) => {
  const speechWhereClauses = [
    Prisma.sql`st.B IN (${Prisma.join(topicIds)})`,
    Prisma.sql`s.councilMeeting = ${meetingId}`,
  ]
  const billWhereClauses = [
    Prisma.sql`bt.B IN (${Prisma.join(topicIds)})`,
    Prisma.sql`b.councilMeeting = ${meetingId}`,
  ]
  if (partyIds.length > 0) {
    const partyClause = Prisma.sql`cm.party IN (${Prisma.join(partyIds)})`
    speechWhereClauses.push(partyClause)
    billWhereClauses.push(partyClause)
  }

  return Prisma.sql`
    WITH work AS (
      SELECT st.B AS topic_id, cm.councilor AS councilor_id, cm.party AS party_id, s.id AS speech_id, NULL AS bill_id
      FROM _CouncilSpeech_topic st
      JOIN CouncilSpeech s ON st.A = s.id
      JOIN _CouncilMember_speech cms ON cms.B = s.id
      JOIN CouncilMember cm ON cms.A = cm.id
      WHERE ${Prisma.join(speechWhereClauses, ' AND ')}

      UNION ALL

      SELECT bt.B AS topic_id, cm.councilor AS councilor_id, cm.party AS party_id, NULL AS speech_id, b.id AS bill_id
      FROM _CouncilBill_topic bt
      JOIN CouncilBill b ON bt.A = b.id
      JOIN _CouncilBill_councilMember bcm ON b.id = bcm.A
      JOIN CouncilMember cm ON bcm.B = cm.id
      WHERE ${Prisma.join(billWhereClauses, ' AND ')}
    ),
    councilor_counts AS (
      SELECT topic_id, councilor_id, party_id, COUNT(DISTINCT speech_id) AS speech_count, COUNT(DISTINCT bill_id) AS bill_count
      FROM work
      GROUP BY topic_id, councilor_id, party_id
    ),
    Rank_c AS (
      SELECT *, ROW_NUMBER() OVER (PARTITION BY topic_id ORDER BY speech_count DESC, bill_count DESC, councilor_id) AS rnk
      FROM councilor_counts
    )
    SELECT rc.topic_id AS topicId, rc.speech_count AS count, c.id, c.name, rc.party_id AS party, c.slug, c.imageLink, p.imageFile_id AS imageId, p.imageFile_extension AS imageExtension
    FROM Rank_c rc
    JOIN Councilor c ON c.id = rc.councilor_id
    LEFT JOIN Photo p ON c.image = p.id
    WHERE rc.rnk <= 5
    ORDER BY rc.topic_id, rc.speech_count DESC, rc.bill_count DESC, rc.councilor_id
  `
}
