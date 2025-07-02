import type { LegislatorModel, TopicModel, SpeechModel } from './graphql'
import type { LegislatorRecord, TopicRecord, SpeechRecord } from './algolia'
import type { Constituency } from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
import { CONSTITUENCY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
import { getUrlOrigin } from './utils'

export function transferSpeechModelToRecord(
  speechModels: SpeechModel[]
): SpeechRecord[] {
  return speechModels.map((s) => {
    return {
      slug: s.slug,
      title: s.title,
      date: s.date,
      term: s.legislativeMeeting?.term,
      session: s.legislativeMeetingSession?.term,
      legislatorName: s.legislativeYuanMember?.legislator?.name,
      summary: s.summary,
    }
  })
}

export function transferLegislatorModelToRecord(
  legislatorModels: LegislatorModel[]
): LegislatorRecord[] {
  return legislatorModels.map((l) => {
    const speechDate = l.speeches?.[0]?.date
    let lastSpeechAt = ''
    let desc = ''
    let shortDesc = ''
    if (l?.party?.name) {
      shortDesc = l.party.name.endsWith('籍')
        ? `${l.party.name}。`
        : `${l.party.name}籍。`
    }
    if (l?.legislativeMeeting?.term) {
      shortDesc = shortDesc + `第${l.legislativeMeeting.term}屆立法委員`
      // ts-ignore
      const constituency = CONSTITUENCY_LABEL[l.constituency as Constituency]
      if (constituency) {
        shortDesc = shortDesc + `（${constituency}）。`
      } else {
        shortDesc = shortDesc + '。'
      }
    }

    if (
      Array.isArray(l.sessionAndCommittee) &&
      l.sessionAndCommittee.length > 0
    ) {
      desc = shortDesc + `加入：`
      const committeeDesc: string[] = []
      l.sessionAndCommittee.forEach((c) => {
        const name = c.committee?.[0]?.name
        const term = c.legislativeMeetingSession?.term
        if (name && term) {
          committeeDesc.push(`${name}（${term}會期）`)
        } else if (name) {
          committeeDesc.push(`${name}`)
        }
      })
      desc = desc + committeeDesc.join('、') + '。'
    }

    if (l.note) {
      desc = desc + l.note
    }

    if (speechDate) {
      const date = new Date(speechDate)
      lastSpeechAt = date.toISOString().split('T')[0].replace(/-/g, '/')
    }

    const urlOrigin = getUrlOrigin()
    const _partyImgSrc = l.party?.image?.imageFile?.url
      ? `${urlOrigin}${l.party?.image?.imageFile?.url}`
      : ''

    return {
      name: l.legislator.name,
      slug: l.legislator.slug,
      term: l.legislativeMeeting.term,
      lastSpeechAt,
      desc,
      shortDesc,
      imgSrc: l.legislator.imageLink || '',
      partyImgSrc: l.party?.imageLink || _partyImgSrc || '',
      objectID: `${l.legislator.slug}_${l.legislativeMeeting.term}`,
    }
  })
}

export function transferTopicModelToRecord(
  topicModels: TopicModel[]
): TopicRecord[] {
  return topicModels.map((t) => {
    const countSum = t.members.reduce((sum: number, m: any) => sum + m.count, 0)
    const desc =
      t.members.length > 0
        ? '發言：' +
          t.members.map((m: any) => `${m.name}(${m.count})`).join('、')
        : ''
    let lastSpeechAt = ''
    if (t.topicInfo.lastSpeechAt) {
      const date = new Date(t.topicInfo.lastSpeechAt)
      lastSpeechAt = date.toISOString().split('T')[0].replace(/-/g, '/')
    }

    return {
      name: t.topicInfo.title,
      slug: t.topicInfo.slug,
      term: t.topicInfo.meetingTerm,
      session: t.topicInfo.sessionTerm,
      desc,
      lastSpeechAt,
      relatedMessageCount: countSum,
      objectID: `${t.topicInfo.slug}_${t.topicInfo.meetingTerm}_${t.topicInfo.sessionTerm}`,
    }
  })
}
