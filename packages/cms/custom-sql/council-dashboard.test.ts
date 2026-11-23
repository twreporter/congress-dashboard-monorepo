import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

const councilTopicsModulePath = './councilTopicsOrderByWork.ts'
const councilorTopicsModulePath = './topNTopicsOfCouncilors.ts'
const { getCouncilTopicsSql, getTop5CouncilorsSql, getCouncilorTopicsSql } =
  await import(councilTopicsModulePath)
const { getCouncilMembersSql } = await import(councilorTopicsModulePath)

const normalizeSql = (sql: string) => sql.replace(/\s+/g, ' ').trim()

describe('council dashboard many-to-many speech queries', () => {
  it('counts a shared speech once while including every related councilor', () => {
    const query = getCouncilTopicsSql({
      meetingId: 1,
      take: 10,
      skip: 0,
    })
    const sql = normalizeSql(query.sql)

    assert.match(
      sql,
      /JOIN _CouncilMember_speech cms ON cms\.B = s\.id JOIN CouncilMember cm ON cms\.A = cm\.id/
    )
    assert.match(sql, /COUNT\(DISTINCT a\.speech_id\) AS speechCount/)
    assert.match(sql, /COUNT\(DISTINCT a\.councilor_id\) AS councilorCount/)
    assert.doesNotMatch(sql, /s\.councilMember/)
  })

  it('attributes a shared speech to each linked councilor for ranking', () => {
    const query = getTop5CouncilorsSql({
      meetingId: 1,
      topicIds: [11],
      partyIds: [31],
    })
    const sql = normalizeSql(query.sql)

    assert.match(
      sql,
      /JOIN _CouncilMember_speech cms ON cms\.B = s\.id JOIN CouncilMember cm ON cms\.A = cm\.id/
    )
    assert.match(sql, /GROUP BY topic_id, councilor_id, party_id/)
    assert.match(sql, /COUNT\(DISTINCT speech_id\) AS speech_count/)
    assert.equal((sql.match(/cm\.party IN \(\?\)/g) ?? []).length, 2)
    assert.deepEqual(query.values, [11, 1, 31, 11, 1, 31])
  })

  it('counts shared speeches independently for each requested council member', () => {
    const query = getCouncilMembersSql({
      councilMeetingId: 1,
      councilMemberIds: [21, 22],
    })
    const sql = normalizeSql(query.sql)

    assert.match(
      sql,
      /JOIN _CouncilMember_speech cms ON cms\.B = s\.id JOIN CouncilMember cm ON cm\.id = cms\.A/
    )
    assert.match(sql, /GROUP BY councilMemberId, topicId/)
    assert.match(sql, /COUNT\(DISTINCT speechId\) AS speechCount/)
  })

  it('aggregates and orders a councilor topic list without nested work payloads', () => {
    const query = getCouncilorTopicsSql({
      meetingId: 1,
      councilorSlug: 'councilor-a',
    })
    const sql = normalizeSql(query.sql)

    assert.match(sql, /JOIN _CouncilMember_speech cms ON cms\.B = s\.id/)
    assert.match(
      sql,
      /COUNT\(DISTINCT CASE WHEN w\.councilor_slug = \? THEN w\.speech_id END\) AS speechCount/
    )
    assert.match(sql, /COUNT\(DISTINCT w\.councilor_id\) AS councilorCount/)
    assert.match(sql, /HAVING speechCount > 0 OR billCount > 0/)
    assert.match(
      sql,
      /ORDER BY speechCount DESC, billCount DESC, councilorCount DESC, t\.id ASC/
    )
    assert.deepEqual(query.values, [1, 1, 'councilor-a', 'councilor-a'])
  })
})
