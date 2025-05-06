import { Prisma } from '@prisma/client'

type Params = {
  meetingId: number
  sessionIds?: number[]
  partyIds?: number[]
  take?: number
  skip?: number
  topicIds?: number[]
}
export const getTopicsSql = ({
  meetingId,
  sessionIds = [],
  partyIds = [],
  take,
  skip,
}: Params) => {
  const hasSession = sessionIds.length > 0
  const hasParty = partyIds.length > 0
  if (!hasSession && !hasParty) {
    return Prisma.sql`
      SELECT t.id, t.title, t.slug, COUNT(*) as speechCount, COUNT(DISTINCT s.legislativeYuanMember) as legislatorCount
      FROM Speech s
      JOIN _Speech_topics st on s.id=st.A
      JOIN Topic t on st.B=t.id
      WHERE s.legislativeMeeting=${meetingId}
      GROUP BY t.id
      ORDER BY speechCount DESC
      LIMIT ${take} OFFSET ${skip}
    `
  } else if (!hasSession && hasParty) {
    return Prisma.sql`
      SELECT t.id, t.title, t.slug, COUNT(*) as speechCount, COUNT(DISTINCT s.legislativeYuanMember) as legislatorCount
      FROM Speech s
      JOIN _Speech_topics st on s.id=st.A
      JOIN Topic t on st.B=t.id
      JOIN LegislativeYuanMember m on m.id=s.legislativeYuanMember
      WHERE s.legislativeMeeting=${meetingId} AND m.party IN (${Prisma.join(
      partyIds
    )})
      GROUP BY t.id
      ORDER BY speechCount DESC
      LIMIT ${take} OFFSET ${skip}
    `
  } else if (hasSession && !hasParty) {
    return Prisma.sql`
      SELECT t.id, t.title, t.slug, COUNT(*) as speechCount, COUNT(DISTINCT s.legislativeYuanMember) as legislatorCount
      FROM Speech s
      JOIN _Speech_topics st on s.id=st.A
      JOIN Topic t on st.B=t.id
      WHERE s.legislativeMeeting=${meetingId} AND s.legislativeMeetingSession IN (${Prisma.join(
      sessionIds
    )})
      GROUP BY t.id
      ORDER BY speechCount DESC
      LIMIT ${take} OFFSET ${skip}
    `
  } else {
    // both sessionIds & partyIds are not empty
    return Prisma.sql`
      SELECT t.id, t.title, t.slug, COUNT(*) as speechCount, COUNT(DISTINCT s.legislativeYuanMember) as legislatorCount
      FROM Speech s
      JOIN _Speech_topics st on s.id=st.A
      JOIN Topic t on st.B=t.id
      JOIN LegislativeYuanMember m on m.id=s.legislativeYuanMember
      WHERE s.legislativeMeeting=${meetingId} AND m.party IN (${Prisma.join(
      partyIds
    )}) AND s.legislativeMeetingSession IN (${Prisma.join(sessionIds)})
      GROUP BY t.id
      ORDER BY speechCount DESC
      LIMIT ${take} OFFSET ${skip}
    `
  }
}

export const getTop5LegislatorSql = ({
  meetingId,
  sessionIds = [],
  partyIds = [],
  topicIds = [],
}: Params) => {
  const hasSession = sessionIds.length > 0
  const hasParty = partyIds.length > 0
  if (!hasSession && !hasParty) {
    return Prisma.sql`
      WITH l_counts AS (
        SELECT st.B as b_id, s.legislativeYuanMember as l_id, COUNT(*) as l_count
        FROM _Speech_topics st
        JOIN Speech s ON st.A=s.id
        WHERE st.B IN (${Prisma.join(
          topicIds
        )}) AND s.legislativeMeeting=${meetingId}
        GROUP BY st.B, s.legislativeYuanMember
      ),
      Rank_l AS(
        SELECT *, ROW_NUMBER() OVER (PARTITION BY b_id ORDER BY l_count DESC) AS rnk
        FROM l_counts
      )
      SELECT rl.b_id as topicId, rl.l_count as count, m.id, l.name, m.party, l.slug, l.imageLink, p.imageFile_id as imageId, p.imageFile_extension as imageExtension
      FROM Rank_l rl
      JOIN LegislativeYuanMember m ON m.id=rl.l_id
      JOIN Legislator l ON m.legislator=l.id
      LEFT JOIN Photo p ON l.image=p.id
      WHERE rl.rnk <= 5
      ORDER BY rl.b_id, rl.l_count DESC
    `
  } else if (!hasSession && hasParty) {
    return Prisma.sql`
      WITH l_counts AS (
        SELECT st.B as b_id, s.legislativeYuanMember as l_id, COUNT(*) as l_count
        FROM _Speech_topics st
        JOIN Speech s ON st.A=s.id
        JOIN LegislativeYuanMember m on m.id=s.legislativeYuanMember
        WHERE st.B IN (${Prisma.join(
          topicIds
        )}) AND s.legislativeMeeting=${meetingId} AND m.party IN (${Prisma.join(
      partyIds
    )})
        GROUP BY st.B, s.legislativeYuanMember
      ),
      Rank_l AS(
        SELECT *, ROW_NUMBER() OVER (PARTITION BY b_id ORDER BY l_count DESC) AS rnk
        FROM l_counts
      )
      SELECT rl.b_id as topicId, rl.l_count as count, m.id, l.name, m.party, l.slug, l.imageLink, p.imageFile_id as imageId, p.imageFile_extension as imageExtension
      FROM Rank_l rl
      JOIN LegislativeYuanMember m ON m.id=rl.l_id
      JOIN Legislator l ON m.legislator=l.id
      LEFT JOIN Photo p ON l.image=p.id
      WHERE rl.rnk <= 5
      ORDER BY rl.b_id, rl.l_count DESC
    `
  } else if (hasSession && !hasParty) {
    return Prisma.sql`
      WITH l_counts AS (
        SELECT st.B as b_id, s.legislativeYuanMember as l_id, COUNT(*) as l_count
        FROM _Speech_topics st
        JOIN Speech s ON st.A=s.id
        WHERE st.B IN (${Prisma.join(
          topicIds
        )}) AND s.legislativeMeeting=${meetingId} AND s.legislativeMeetingSession IN (${Prisma.join(
      sessionIds
    )})
        GROUP BY st.B, s.legislativeYuanMember
      ),
      Rank_l AS(
        SELECT *, ROW_NUMBER() OVER (PARTITION BY b_id ORDER BY l_count DESC) AS rnk
        FROM l_counts
      )
      SELECT rl.b_id as topicId, rl.l_count as count, m.id, l.name, m.party, l.slug, l.imageLink, p.imageFile_id as imageId, p.imageFile_extension as imageExtension
      FROM Rank_l rl
      JOIN LegislativeYuanMember m ON m.id=rl.l_id
      JOIN Legislator l ON m.legislator=l.id
      LEFT JOIN Photo p ON l.image=p.id
      WHERE rl.rnk <= 5
      ORDER BY rl.b_id, rl.l_count DESC
    `
  } else {
    // both sessionIds & partyIds are not empty
    return Prisma.sql`
      WITH l_counts AS (
        SELECT st.B as b_id, s.legislativeYuanMember as l_id, COUNT(*) as l_count
        FROM _Speech_topics st
        JOIN Speech s ON st.A=s.id
        JOIN LegislativeYuanMember m on m.id=s.legislativeYuanMember
        WHERE st.B IN (${Prisma.join(
          topicIds
        )}) AND s.legislativeMeeting=${meetingId} AND m.party IN (${Prisma.join(
      partyIds
    )}) AND s.legislativeMeetingSession IN (${Prisma.join(sessionIds)})
        GROUP BY st.B, s.legislativeYuanMember
      ),
      Rank_l AS(
        SELECT *, ROW_NUMBER() OVER (PARTITION BY b_id ORDER BY l_count DESC) AS rnk
        FROM l_counts
      )
      SELECT rl.b_id as topicId, rl.l_count as count, m.id, l.name, m.party, l.slug, l.imageLink, p.imageFile_id as imageId, p.imageFile_extension as imageExtension
      FROM Rank_l rl
      JOIN LegislativeYuanMember m ON m.id=rl.l_id
      JOIN Legislator l ON m.legislator=l.id
      LEFT JOIN Photo p ON l.image=p.id
      WHERE rl.rnk <= 5
      ORDER BY rl.b_id, rl.l_count DESC
    `
  }
}
