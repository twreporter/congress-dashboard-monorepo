import assert from 'node:assert/strict'
import { it } from 'node:test'

// Execute the portable aggregation SQL against fixtures, rather than asserting
// its spelling. Production query plans still need validation on MySQL.
const sqliteModule = 'node:sqlite'
const sqlModule = './featuredCouncilTopics.ts'
const { DatabaseSync } = await import(sqliteModule)
const { getFeaturedCouncilTopicsSql } = await import(sqlModule)

it('deduplicates shared work, retains unassigned work, and limits avatars', () => {
  const db = new DatabaseSync(':memory:')
  try {
    db.exec(`
      CREATE TABLE CouncilTopic (id INTEGER, title TEXT, slug TEXT, city TEXT, type TEXT);
      CREATE TABLE CouncilMeeting (id INTEGER, city TEXT, term INTEGER);
      CREATE TABLE CouncilSpeech (id INTEGER, councilMeeting INTEGER);
      CREATE TABLE CouncilBill (id INTEGER, councilMeeting INTEGER);
      CREATE TABLE CouncilMember (id INTEGER, councilor INTEGER);
      CREATE TABLE Councilor (id INTEGER, name TEXT, slug TEXT, imageLink TEXT, image INTEGER);
      CREATE TABLE Photo (id INTEGER, imageFile_id TEXT, imageFile_extension TEXT);
      CREATE TABLE _CouncilSpeech_topic (A INTEGER, B INTEGER);
      CREATE TABLE _CouncilMember_speech (A INTEGER, B INTEGER);
      CREATE TABLE _CouncilBill_topic (A INTEGER, B INTEGER);
      CREATE TABLE _CouncilBill_councilMember (A INTEGER, B INTEGER);
      INSERT INTO CouncilTopic VALUES
        (1, 'Shared', 'shared', 'taipei', 'twreporter'),
        (2, 'Unassigned', 'unassigned', 'taipei', 'twreporter'),
        (3, 'Empty', 'empty', 'taipei', 'twreporter'),
        (4, 'Other city', 'other-city', 'tainan', 'twreporter'),
        (5, 'General', 'general', 'taipei', 'general');
      INSERT INTO _CouncilSpeech_topic VALUES (10, 1), (11, 1), (12, 2), (10, 4), (10, 5);
      INSERT INTO _CouncilBill_topic VALUES (20, 1), (21, 2);
      INSERT INTO Photo VALUES (1, 'avatar', 'png');
      INSERT INTO CouncilMeeting VALUES (1, 'taipei', 1), (2, 'taipei', 2), (3, 'tainan', 99);
      INSERT INTO CouncilSpeech VALUES (10, 2), (11, 2), (12, 2);
      INSERT INTO CouncilBill VALUES (20, 2), (21, 2);
    `)
    for (let id = 1; id <= 6; id++) {
      db.prepare('INSERT INTO Councilor VALUES (?, ?, ?, ?, ?)').run(
        id,
        `Councilor ${id}`,
        `c-${id}`,
        '',
        id === 1 ? 1 : null
      )
      db.prepare('INSERT INTO CouncilMember VALUES (?, ?)').run(id, id)
      db.prepare('INSERT INTO _CouncilMember_speech VALUES (?, 10)').run(id)
    }
    db.exec(`
      INSERT INTO CouncilMember VALUES (7, 1), (8, NULL);
      INSERT INTO _CouncilMember_speech VALUES (7, 10), (1, 11), (8, 12);
      INSERT INTO _CouncilBill_councilMember VALUES (20, 1), (20, 7), (20, 6);
    `)
    const query = getFeaturedCouncilTopicsSql('taipei')
    const rows = db.prepare(query.sql).all(...query.values)
    assert.equal(rows.length, 6) // Five avatars plus one unassigned topic.
    const shared = rows.filter((row: { topicId: number }) => row.topicId === 1)
    assert.equal(shared.length, 5)
    for (const row of shared) {
      assert.equal(row.speechCount, 2)
      assert.equal(row.billCount, 1)
      assert.equal(row.councilorCount, 6)
    }
    assert.deepEqual(
      shared.map((row: { id: number }) => row.id),
      [1, 6, 2, 3, 4]
    )
    assert.equal(shared[0].count, 2)
    assert.equal(shared[0].imageId, 'avatar')
    assert.equal(rows[5].topicId, 2)
    assert.equal(rows[5].speechCount, 1)
    assert.equal(rows[5].billCount, 1)
    assert.equal(rows[5].councilorCount, 0)
    assert.equal(rows[5].id, null)

    // Older and other-city work must not affect totals or avatar rankings.
    db.exec(`
      INSERT INTO CouncilTopic VALUES (6, 'Historical', 'historical', 'taipei', 'twreporter');
      INSERT INTO CouncilSpeech VALUES (13, 1), (14, 3);
      INSERT INTO CouncilBill VALUES (22, 1), (23, 3);
      INSERT INTO _CouncilSpeech_topic VALUES (13, 1), (13, 6), (14, 1);
      INSERT INTO _CouncilBill_topic VALUES (22, 1), (22, 6), (23, 1);
      INSERT INTO _CouncilMember_speech VALUES (5, 13), (5, 14);
      INSERT INTO _CouncilBill_councilMember VALUES (22, 5), (23, 5);
    `)
    assert.deepEqual(db.prepare(query.sql).all(...query.values), rows)
    // A new term without work should not fall back to an older term.
    db.exec("INSERT INTO CouncilMeeting VALUES (4, 'taipei', 3)")
    assert.deepEqual(db.prepare(query.sql).all(...query.values), [])
    const missing = getFeaturedCouncilTopicsSql('missing')
    assert.deepEqual(db.prepare(missing.sql).all(...missing.values), [])
  } finally {
    db.close()
  }
})
