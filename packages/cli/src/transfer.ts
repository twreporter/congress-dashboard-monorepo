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
import {
  councilDisplayNames,
  councilRankings,
  type CouncilName,
} from './council-config'

/**
 * Convert ISO date string to YYYY/MM/DD format in UTC+8 timezone.
 * Handles both date-only strings (YYYY-MM-DD) and full ISO timestamps.
 */
function formatDateToTaipeiTimezone(isoDateString: string): string {
  const date = new Date(isoDateString)

  // Use Intl.DateTimeFormat for proper timezone handling
  const formatter = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const year = parts.find((p) => p.type === 'year')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  const day = parts.find((p) => p.type === 'day')?.value

  return `${year}/${month}/${day}`
}

export function transferSpeechModelToRecord(
  speechModels: SpeechModel[]
): SpeechRecord[] {
  // Filter out records without required meeting term (defensive)
  const validModels = speechModels.filter((s) => s.legislativeMeeting?.term)

  return validModels.map((s) => {
    const summary = s.summary
      // remove html tags
      ?.replace(/<\/?[a-z][\s\S]*?>/gi, '')
      // remove line break
      ?.replace(/\r?\n/g, '')
    return {
      objectID: s.slug,
      slug: s.slug,
      title: s.title,
      date: s.date ? formatDateToTaipeiTimezone(s.date) : '',
      dateTs: s.date ? new Date(s.date).getTime() : undefined,
      meetingTerm: s.legislativeMeeting!.term,
      sessionTerm: s.legislativeMeetingSession?.term,
      legislatorName: s.legislativeYuanMember?.legislator?.name,
      summary,
    }
  })
}

export function transferLegislatorModelToRecord(
  legislatorModels: LegislatorModel[]
): LegislatorRecord[] {
  // Filter out records without legislator identity (defensive)
  const validModels = legislatorModels.filter(
    (l) => l.legislator?.slug && l.legislator?.name
  )

  return validModels.map((l) => {
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
      lastSpeechAt = formatDateToTaipeiTimezone(speechDate)
      lastSpeechAtTs = new Date(speechDate).getTime()
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
      // Skip speeches without member info (defensive)
      if (!speech.legislativeYuanMember) continue

      // Composite key to separate topics by meeting term
      const topicMapKey = `${topic.slug}_${speech.legislativeMeeting.term}`

      // Initialize topic info in map if not yet present
      if (!topicMap.has(topicMapKey)) {
        topicMap.set(topicMapKey, {
          id: topic.id.toString(),
          slug: topic.slug,
          title: topic.title,
          lastSpeechAt: speech.date,
          meetingTerm: speech.legislativeMeeting.term,
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

      const member = speech.legislativeYuanMember
      const memberName = member.legislator?.name

      // Skip members without valid legislator names
      if (!memberName) continue

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
          name: memberName,
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
        lastSpeechAt = formatDateToTaipeiTimezone(_lastSpeechAt)
        lastSpeechAtTs = new Date(_lastSpeechAt).getTime()
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
  // Filter out records without councilMeeting.term and valid councilor identity (defensive)
  const validModels = councilorModels.filter(
    (c) => c.councilMeeting?.term && c.councilor?.slug && c.councilor?.name
  )

  return validModels.map((c) => {
    const billDate = c.bill?.[0]?.date
    const councilName = c.city as CouncilName
    const councilDisplayName = councilDisplayNames[councilName] || councilName
    const councilorSlug = c.councilor!.slug
    const councilorName = c.councilor!.name
    const term = c.councilMeeting!.term
    const constituency = c.constituency

    let desc = ''
    if (c.party?.name) {
      desc = c.party.name.endsWith('籍')
        ? `${c.party.name}，`
        : `${c.party.name}籍，`
    }

    desc = desc + `現任第 ${term} 屆${councilDisplayName}議員`
    if (constituency) {
      desc = desc + `（第 ${constituency} 選舉區）`
    }
    desc = desc + '。'

    if (c.note) {
      desc = desc + c.note
    }

    let lastSpeechAt = ''
    let lastSpeechAtTs: number | undefined
    if (billDate) {
      lastSpeechAt = formatDateToTaipeiTimezone(billDate)
      lastSpeechAtTs = new Date(billDate).getTime()
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
      councilRank: councilRankings[councilName] || 999,
      meetingTerm: term,
      lastSpeechAt,
      lastSpeechAtTs,
      desc,
      imgSrc: c.councilor?.imageLink || '',
      partyImgSrc: c.party?.imageLink || _partyImgSrc || '',
      objectID: `${c.id}_${councilName}_${term}`,
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
    const councilName = topic.city
    // Filter bills with councilMeeting.term (defensive)
    const validBills = topic.bill.filter((b) => b.councilMeeting?.term)

    // Skip topic if no valid bills
    if (validBills.length === 0) continue

    for (const bill of validBills) {
      const topicMapKey = `${topic.slug}_${councilName}`

      if (!topicMap.has(topicMapKey)) {
        topicMap.set(topicMapKey, {
          id: topic.id.toString(),
          slug: topic.slug,
          title: topic.title,
          lastSpeechAt: bill.date,
          council: councilName,
          meetingTerm: bill.councilMeeting!.term,
          billCount: validBills.length,
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
          mapValue.meetingTerm = bill.councilMeeting!.term
        }
      }

      const memberMap = topicMap.get(topicMapKey)?.memberMap
      const councilMembers = bill.councilMember || []

      for (const member of councilMembers) {
        const memberName = member.councilor?.name

        // Skip members without valid councilor names
        if (!memberName) continue

        const memberId = member.id.toString()
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

  return Array.from(topicMap.entries())
    .filter(([, topicInfo]) => topicInfo.meetingTerm !== undefined) // Filter out topics without term
    .map(
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
        let lastSpeechAtTs: number | undefined
        if (_lastSpeechAt) {
          lastSpeechAt = formatDateToTaipeiTimezone(_lastSpeechAt)
          lastSpeechAtTs = new Date(_lastSpeechAt).getTime()
        }

        return {
          name: title,
          slug,
          council: councilDisplayName,
          councilSlug: council,
          councilRank: councilRankings[council as CouncilName] || 999,
          meetingTerm: meetingTerm!,
          billCount,
          desc,
          lastSpeechAt,
          lastSpeechAtTs,
          objectID: `${slug}_${council}_${meetingTerm}`,
        }
      }
    )
}

export function transferCouncilBillModelToRecord(
  billModels: CouncilBillModel[]
): CouncilBillRecord[] {
  // Filter out records without councilMeeting.term and city (defensive)
  const validModels = billModels.filter(
    (b) => b.councilMeeting?.term && b.councilMeeting?.city
  )

  return validModels.map((b) => {
    const councilName = b.councilMeeting!.city
    const councilDisplayName =
      councilDisplayNames[councilName as CouncilName] || councilName
    const meetingTerm = b.councilMeeting!.term
    const councilMembers = b.councilMember || []
    const firstCouncilor = councilMembers?.[0]?.councilor?.name || ''
    const councilorCount = councilMembers.length

    const summary =
      typeof b.summaryFallback === 'string'
        ? b.summaryFallback
            .replace(/<\/?[a-z][\s\S]*?>/gi, '')
            .replace(/\r?\n/g, '')
        : ''

    return {
      slug: b.slug,
      title: b.title,
      date: b.date ? formatDateToTaipeiTimezone(b.date) : '',
      dateTs: b.date ? new Date(b.date).getTime() : undefined,
      summary,
      council: councilDisplayName,
      councilSlug: councilName,
      councilRank: councilRankings[councilName as CouncilName] || 999,
      meetingTerm,
      councilor: firstCouncilor,
      councilorCount,
      objectID: `${b.slug}_${councilName}_${meetingTerm}`,
    }
  })
}
