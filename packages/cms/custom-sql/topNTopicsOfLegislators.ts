import { Prisma } from '@prisma/client'

type Params = {
  meetingId: number
  sessionIds?: number[]
  take?: number
  legislatorIds: number[]
}

export const getLegislatorsSql = ({
  legislatorIds,
  meetingId,
  sessionIds = [],
  take = 10,
}: Params) => {
  const hasSession = sessionIds.length > 0

  if (!hasSession) {
    return Prisma.sql`
      SELECT legislatorId, title, slug, count
      FROM (
        SELECT
          s.legislativeYuanMember AS legislatorId,
          t.title                    AS title,
          t.slug                  AS slug,
          COUNT(*)                AS count,
          ROW_NUMBER() OVER (
            PARTITION BY s.legislativeYuanMember
            ORDER BY COUNT(*) DESC
          ) AS rn
        FROM _Speech_topics st
        JOIN Speech s ON s.id = st.A
        JOIN Topic  t ON t.id = st.B
        WHERE s.legislativeMeeting = ${meetingId} AND
              s.legislativeYuanMember IN (${Prisma.join(legislatorIds)})
        GROUP BY s.legislativeYuanMember, t.id
      ) AS ranked
      WHERE rn <= ${take}
      ORDER BY legislatorId, count DESC;
    `
  } else {
    return Prisma.sql`
      SELECT legislatorId, title, slug, count
      FROM (
        SELECT
          s.legislativeYuanMember AS legislatorId,
          t.title                    AS title,
          t.slug                  AS slug,
          COUNT(*)                AS count,
          ROW_NUMBER() OVER (
            PARTITION BY s.legislativeYuanMember
            ORDER BY COUNT(*) DESC
          ) AS rn
        FROM _Speech_topics st
        JOIN Speech s ON s.id = st.A
        JOIN Topic  t ON t.id = st.B
        WHERE s.legislativeMeeting = ${meetingId} AND
              s.legislativeYuanMember IN (${Prisma.join(legislatorIds)}) AND
              s.legislativeMeetingSession IN (${Prisma.join(sessionIds)})
        GROUP BY s.legislativeYuanMember, t.id
      ) AS ranked
      WHERE rn <= ${take}
      ORDER BY legislatorId, count DESC;
    `
  }
}
