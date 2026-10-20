import { Prisma } from '@prisma/client'

/**
 * Preserve all-term featured-topic counts, including work without members.
 * Only the five ranked councilors per topic need profile/image data.
 */
export const getFeaturedCouncilTopicsSql = (city: string) => Prisma.sql`
  WITH featured AS (
    SELECT id, title, slug FROM CouncilTopic
    WHERE city = ${city} AND type = 'twreporter'
  ),
  work AS (
    SELECT st.B AS topic_id, st.A AS speech_id, NULL AS bill_id, cm.councilor AS councilor_id
    FROM featured t
    JOIN _CouncilSpeech_topic st ON st.B = t.id
    LEFT JOIN _CouncilMember_speech cms ON cms.B = st.A
    LEFT JOIN CouncilMember cm ON cm.id = cms.A

    UNION ALL

    SELECT bt.B AS topic_id, NULL AS speech_id, bt.A AS bill_id, cm.councilor AS councilor_id
    FROM featured t
    JOIN _CouncilBill_topic bt ON bt.B = t.id
    LEFT JOIN _CouncilBill_councilMember bcm ON bcm.A = bt.A
    LEFT JOIN CouncilMember cm ON cm.id = bcm.B
  ),
  totals AS (
    SELECT topic_id,
      COUNT(DISTINCT speech_id) AS speechCount,
      COUNT(DISTINCT bill_id) AS billCount,
      COUNT(DISTINCT councilor_id) AS councilorCount
    FROM work
    GROUP BY topic_id
  ),
  participation AS (
    SELECT topic_id, councilor_id,
      COUNT(DISTINCT speech_id) AS speech_count,
      COUNT(DISTINCT bill_id) AS bill_count
    FROM work
    WHERE councilor_id IS NOT NULL
    GROUP BY topic_id, councilor_id
  ),
  ranked AS (
    SELECT topic_id, councilor_id, speech_count,
      ROW_NUMBER() OVER (
        PARTITION BY topic_id
        ORDER BY speech_count DESC, bill_count DESC, councilor_id ASC
      ) AS rn
    FROM participation
  )
  SELECT t.id AS topicId, t.title, t.slug,
    totals.speechCount, totals.billCount, totals.councilorCount,
    c.id, c.name, c.slug AS councilorSlug, c.imageLink,
    p.imageFile_id AS imageId, p.imageFile_extension AS imageExtension,
    ranked.speech_count AS count
  FROM featured t
  JOIN totals ON totals.topic_id = t.id
  LEFT JOIN ranked ON ranked.topic_id = t.id AND ranked.rn <= 5
  LEFT JOIN Councilor c ON c.id = ranked.councilor_id
  LEFT JOIN Photo p ON p.id = c.image
  ORDER BY totals.speechCount DESC, totals.billCount DESC,
    totals.councilorCount DESC, t.id ASC, ranked.rn ASC
`
