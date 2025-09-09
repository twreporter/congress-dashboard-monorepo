import type { LegislatorModel, TopicModel, SpeechModel } from './graphql'
import type { LegislatorRecord, TopicRecord, SpeechRecord } from './algolia'
import type { Constituency } from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
import {
  CONSTITUENCY_LABEL,
  MEMBER_TYPE_LABEL,
  MemberType,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
import { getUrlOrigin } from './utils'

export function transferSpeechModelToRecord(
  speechModels: SpeechModel[]
): SpeechRecord[] {
  return speechModels.map((s) => {
    const summary = s.summary
      // remove html tags
      ?.replace(/<\/?[a-z][\s\S]*?>/gi, '')
      // remove line break
      ?.replace(/\r?\n/g, '')
    return {
      objectID: s.slug,
      slug: s.slug,
      title: s.title,
      date: s.date,
      meetingTerm: s.legislativeMeeting?.term,
      sessionTerm: s.legislativeMeetingSession?.term,
      legislatorName: s.legislativeYuanMember?.legislator?.name,
      summary,
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
        ? `${l.party.name}，`
        : `${l.party.name}籍，`
    }

    const meetingTerm = l?.legislativeMeeting?.term

    if (meetingTerm) {
      shortDesc = shortDesc + `第${meetingTerm}屆立法委員`
      if (l.type !== MemberType.Constituency) {
        const memberType = MEMBER_TYPE_LABEL[l.type as MemberType]
        if (memberType) {
          shortDesc = shortDesc + `（${memberType}）`
        }
      } else {
        const constituency = CONSTITUENCY_LABEL[l.constituency as Constituency]
        if (constituency) {
          shortDesc = shortDesc + `（${constituency}）`
        }
      }
    }

    if (
      Array.isArray(l.sessionAndCommittee) &&
      l.sessionAndCommittee.length > 0
    ) {
      desc = shortDesc + `。加入：`
      const committeeDesc: string[] = []
      l.sessionAndCommittee.forEach((c) => {
        const name = c.committee?.[0]?.name
        const sessionTerm = c.legislativeMeetingSession?.term
        if (name && sessionTerm) {
          committeeDesc.push(`${name}（${sessionTerm}會期）`)
        } else if (name) {
          committeeDesc.push(`${name}`)
        }
      })
      desc = desc + committeeDesc.join('、')
    }

    if (l.note) {
      desc = desc + '。' + l.note
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
      meetingTerm,
      lastSpeechAt,
      desc,
      shortDesc,
      imgSrc: l.legislator.imageLink || '',
      partyImgSrc: l.party?.imageLink || _partyImgSrc || '',
      objectID: `${l.legislator.slug}_${meetingTerm}`,
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
        ? t.members.map((m: any) => `${m.name}(${m.count})`).join('、')
        : ''
    let lastSpeechAt = ''
    if (t.topicInfo.lastSpeechAt) {
      const date = new Date(t.topicInfo.lastSpeechAt)
      lastSpeechAt = date.toISOString().split('T')[0].replace(/-/g, '/')
    }

    return {
      name: t.topicInfo.title,
      slug: t.topicInfo.slug,
      meetingTerm: t.topicInfo.meetingTerm,
      desc,
      lastSpeechAt,
      relatedMessageCount: countSum,
      objectID: `${t.topicInfo.slug}_${t.topicInfo.meetingTerm}`,
    }
  })
}
