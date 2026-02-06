import type {
  LegislatorModel,
  TopicModel,
  SpeechModel,
  CouncilorModel,
  CouncilTopicModel,
  CouncilBillModel,
} from './graphql'
import type {
  LegislatorRecord,
  TopicRecord,
  SpeechRecord,
  CouncilorRecord,
  CouncilTopicRecord,
  CouncilBillRecord,
} from './algolia'
import type { Constituency } from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
import {
  CONSTITUENCY_LABEL,
  MEMBER_TYPE_LABEL,
  MemberType,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
import { getUrlOrigin } from './utils'
import { councilDisplayNames, type CouncilName } from './council-config'

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
      dateTs: s.date ? new Date(s.date).getTime() : undefined,
      meetingTerm: s.legislativeMeeting?.term as number,
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

    let lastSpeechAt = ''
    let lastSpeechAtTs

    if (speechDate) {
      const date = new Date(speechDate)
      lastSpeechAt = date.toISOString().split('T')[0].replace(/-/g, '/')
      lastSpeechAtTs = date.getTime()
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
      lastSpeechAtTs,
      desc,
      shortDesc,
      imgSrc: l.legislator.imageLink || '',
      partyImgSrc: l.party?.imageLink || _partyImgSrc || '',
      objectID: `${l.legislator.slug}_${meetingTerm}`,
    }
  })
}

type MemberInfoMap = Map<
  string,
  {
    memberId: string
    name: string
    count: number
  }
>

type TopicInfoMap = Map<
  string,
  {
    id: string
    slug: string
    title: string
    lastSpeechAt: string
    meetingTerm: number
    memberMap: MemberInfoMap
  }
>

export function transferTopicModelToRecord(
  topicModels: TopicModel[]
): TopicRecord[] {
  // Use a map to group topics uniquely by slug + meeting term
  const topicMap: TopicInfoMap = new Map()

  for (const topic of topicModels) {
    const speeches = topic.speeches
    for (const speech of speeches) {
      // Composite key to separate topics by meeting term
      const topicMapKey = `${topic.slug}_${speech.legislativeMeeting?.term}`

      // Initialize topic info in map if not yet present
      if (!topicMap.has(topicMapKey)) {
        topicMap.set(topicMapKey, {
          id: topic.id.toString(),
          slug: topic.slug,
          title: topic.title,
          lastSpeechAt: speech.date,
          meetingTerm: speech.legislativeMeeting?.term,
          // Initialize member info in map
          memberMap: new Map(),
        })
      } else {
        // Update latest speech date for this topic instance
        const mapValue = topicMap.get(topicMapKey)
        if (
          mapValue &&
          (!mapValue.lastSpeechAt ||
            new Date(mapValue.lastSpeechAt) < new Date(speech.date))
        ) {
          mapValue.lastSpeechAt = speech.date
        }
      }

      const member = speech.legislativeYuanMember!
      const memberMap = topicMap.get(topicMapKey)?.memberMap
      const memberId = member.id.toString()
      const existing = memberMap?.get(memberId)

      if (existing) {
        // If already counted, increment speech count
        existing.count += 1
      } else {
        // Otherwise, add a new member speech record
        memberMap?.set(memberId, {
          memberId,
          name: member.legislator?.name ?? '',
          count: 1,
        })
      }
    }
  }

  return Array.from(topicMap.entries()).map(
    ([
      ,
      { title, slug, lastSpeechAt: _lastSpeechAt, meetingTerm, memberMap },
    ]) => {
      const members = Array.from(memberMap.values()).sort(
        (a, b) => b.count - a.count
      )
      const countSum = members.reduce((sum: number, m: any) => sum + m.count, 0)
      const desc =
        members.length > 0
          ? members.map((m: any) => `${m.name}(${m.count})`).join('、')
          : ''

      let lastSpeechAt = ''
      let lastSpeechAtTs

      if (_lastSpeechAt) {
        const date = new Date(_lastSpeechAt)
        lastSpeechAt = date.toISOString().split('T')[0].replace(/-/g, '/')
        lastSpeechAtTs = date.getTime()
      }

      return {
        name: title,
        slug: slug,
        meetingTerm: meetingTerm,
        desc,
        lastSpeechAt,
        lastSpeechAtTs,
        relatedMessageCount: countSum,
        objectID: `${slug}_${meetingTerm}`,
      }
    }
  )
}

export function transferCouncilorModelToRecord(
  councilorModels: CouncilorModel[]
): CouncilorRecord[] {
  return councilorModels.map((c) => {
    const billDate = c.bill?.[0]?.date
    const councilName = c.city as CouncilName
    const councilDisplayName = councilDisplayNames[councilName] || councilName
    const councilorSlug = c.councilor?.slug || ''
    const councilorName = c.councilor?.name || ''
    const term = c.councilMeeting?.term
    const constituency = c.constituency

    let desc = ''
    if (c.party?.name) {
      desc = c.party.name.endsWith('籍')
        ? `${c.party.name}，`
        : `${c.party.name}籍，`
    }

    if (term) {
      desc = desc + `現任第 ${term} 屆${councilDisplayName}議員`
      if (constituency) {
        desc = desc + `（第 ${constituency} 選舉區）`
      }
      desc = desc + '。'
    }

    if (c.note) {
      desc = desc + c.note
    }

    let lastSpeechAt = ''
    if (billDate) {
      const date = new Date(billDate)
      lastSpeechAt = date.toISOString().split('T')[0].replace(/-/g, '/')
    }

    const urlOrigin = getUrlOrigin()
    const _partyImgSrc = c.party?.image?.imageFile?.url
      ? `${urlOrigin}${c.party?.image?.imageFile?.url}`
      : ''

    return {
      name: councilorName,
      slug: councilorSlug,
      council: councilDisplayName,
      councilSlug: councilName,
      meetingTerm: term,
      lastSpeechAt,
      desc,
      imgSrc: c.councilor?.imageLink || '',
      partyImgSrc: c.party?.imageLink || _partyImgSrc || '',
      objectID: `${councilorSlug}_${councilName}`,
    }
  })
}

type CouncilMemberInfoMap = Map<
  string,
  {
    memberId: string
    name: string
    count: number
  }
>

type CouncilTopicInfoMap = Map<
  string,
  {
    id: string
    slug: string
    title: string
    lastSpeechAt: string
    council: string
    meetingTerm?: number
    billCount: number
    memberMap: CouncilMemberInfoMap
  }
>

export function transferCouncilTopicModelToRecord(
  topicModels: CouncilTopicModel[]
): CouncilTopicRecord[] {
  const topicMap: CouncilTopicInfoMap = new Map()

  for (const topic of topicModels) {
    const bills = topic.bill
    const councilName = topic.city

    for (const bill of bills) {
      const topicMapKey = `${topic.slug}_${councilName}`

      if (!topicMap.has(topicMapKey)) {
        topicMap.set(topicMapKey, {
          id: topic.id.toString(),
          slug: topic.slug,
          title: topic.title,
          lastSpeechAt: bill.date,
          council: councilName,
          meetingTerm: bill.councilMeeting?.term,
          billCount: bills.length,
          memberMap: new Map(),
        })
      } else {
        const mapValue = topicMap.get(topicMapKey)
        if (
          mapValue &&
          (!mapValue.lastSpeechAt ||
            new Date(mapValue.lastSpeechAt) < new Date(bill.date))
        ) {
          mapValue.lastSpeechAt = bill.date
          // Update meetingTerm to the latest bill's term
          if (bill.councilMeeting?.term) {
            mapValue.meetingTerm = bill.councilMeeting.term
          }
        }
      }

      const memberMap = topicMap.get(topicMapKey)?.memberMap
      const councilMembers = bill.councilMember || []

      for (const member of councilMembers) {
        const memberId = member.id.toString()
        const memberName = member.councilor?.name || ''
        const existing = memberMap?.get(memberId)

        if (existing) {
          existing.count += 1
        } else {
          memberMap?.set(memberId, {
            memberId,
            name: memberName,
            count: 1,
          })
        }
      }
    }
  }

  return Array.from(topicMap.entries()).map(
    ([
      ,
      {
        title,
        slug,
        lastSpeechAt: _lastSpeechAt,
        council,
        meetingTerm,
        billCount,
        memberMap,
      },
    ]) => {
      const councilDisplayName =
        councilDisplayNames[council as CouncilName] || council
      const members = Array.from(memberMap.values()).sort(
        (a, b) => b.count - a.count
      )
      const desc =
        members.length > 0
          ? members.map((m) => `${m.name}(${m.count})`).join('、')
          : ''

      let lastSpeechAt = ''
      if (_lastSpeechAt) {
        const date = new Date(_lastSpeechAt)
        lastSpeechAt = date.toISOString().split('T')[0].replace(/-/g, '/')
      }

      return {
        name: title,
        slug,
        council: councilDisplayName,
        councilSlug: council,
        meetingTerm,
        billCount,
        desc,
        lastSpeechAt,
        objectID: `${slug}_${council}`,
      }
    }
  )
}

export function transferCouncilBillModelToRecord(
  billModels: CouncilBillModel[]
): CouncilBillRecord[] {
  return billModels.map((b) => {
    const councilName = b.councilMeeting?.city || ''
    const councilDisplayName =
      councilDisplayNames[councilName as CouncilName] || councilName
    const councilMembers = b.councilMember || []
    const firstCouncilor = councilMembers?.[0]?.councilor?.name || ''
    const councilorCount = councilMembers.length

    const councilor =
      councilorCount > 1
        ? `${firstCouncilor}等${councilorCount}人`
        : firstCouncilor

    const summary =
      typeof b.summary === 'string'
        ? b.summary.replace(/<\/?[a-z][\s\S]*?>/gi, '').replace(/\r?\n/g, '')
        : ''

    return {
      slug: b.slug,
      title: b.title,
      date: b.date,
      summary: summary || undefined,
      council: councilDisplayName,
      councilor,
      objectID: `${b.slug}_${councilName}`,
    }
  })
}
