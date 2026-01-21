import { Prisma } from '@prisma/client'

type Params = {
  councilMeetingId: number
  take?: number
  councilMemberIds: number[]
}

/**
 * Get top N topics for council members based on bill count
 */
export const getCouncilMembersSql = ({
  councilMemberIds,
  councilMeetingId,
  take = 10,
}: Params) => {
  return Prisma.sql`
    SELECT councilMemberId, title, slug, count
    FROM (
      SELECT
        cm.id AS councilMemberId,
        t.title AS title,
        t.slug AS slug,
        COUNT(DISTINCT b.id) AS count,
        ROW_NUMBER() OVER (
          PARTITION BY cm.id
          ORDER BY COUNT(DISTINCT b.id) DESC
        ) AS rn
      FROM _CouncilBill_topic bt
      JOIN CouncilBill b ON b.id = bt.A
      JOIN CouncilTopic t ON t.id = bt.B
      JOIN _CouncilBill_councilMember bcm ON b.id = bcm.A
      JOIN CouncilMember cm ON cm.id = bcm.B
      WHERE b.councilMeeting = ${councilMeetingId} AND
            cm.id IN (${Prisma.join(councilMemberIds)})
      GROUP BY cm.id, t.id
    ) AS ranked
    WHERE rn <= ${take}
    ORDER BY councilMemberId, count DESC;
  `
}
