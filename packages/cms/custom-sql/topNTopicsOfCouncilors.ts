import { Prisma } from '@prisma/client'

type Params = {
  councilMeetingId: number
  take?: number
  councilMemberIds: number[]
}

/**
 * Get top N topics for council members ordered by speech count, then bill
 * count (both descending).
 */
export const getCouncilMembersSql = ({
  councilMemberIds,
  councilMeetingId,
  take = 10,
}: Params) => {
  return Prisma.sql`
    WITH work AS (
      SELECT cm.id AS councilMemberId, st.B AS topicId, s.id AS speechId, NULL AS billId
      FROM _CouncilSpeech_topic st
      JOIN CouncilSpeech s ON s.id = st.A
      JOIN _CouncilMember_speech cms ON cms.B = s.id
      JOIN CouncilMember cm ON cm.id = cms.A
      WHERE s.councilMeeting = ${councilMeetingId}
        AND cm.id IN (${Prisma.join(councilMemberIds)})

      UNION ALL

      SELECT cm.id AS councilMemberId, bt.B AS topicId, NULL AS speechId, b.id AS billId
      FROM _CouncilBill_topic bt
      JOIN CouncilBill b ON b.id = bt.A
      JOIN _CouncilBill_councilMember bcm ON b.id = bcm.A
      JOIN CouncilMember cm ON cm.id = bcm.B
      WHERE b.councilMeeting = ${councilMeetingId}
        AND cm.id IN (${Prisma.join(councilMemberIds)})
    ),
    topic_counts AS (
      SELECT
        councilMemberId,
        topicId,
        COUNT(DISTINCT speechId) AS speechCount,
        COUNT(DISTINCT billId) AS billCount
      FROM work
      GROUP BY councilMemberId, topicId
    ),
    ranked AS (
      SELECT
        tc.councilMemberId,
        t.title AS title,
        t.slug AS slug,
        tc.speechCount AS count,
        ROW_NUMBER() OVER (
          PARTITION BY tc.councilMemberId
          ORDER BY tc.speechCount DESC, tc.billCount DESC, tc.topicId ASC
        ) AS rn
      FROM topic_counts tc
      JOIN CouncilTopic t ON t.id = tc.topicId
    )
    SELECT councilMemberId, title, slug, count
    FROM ranked
    WHERE rn <= ${take}
    ORDER BY councilMemberId, rn;
  `
}
