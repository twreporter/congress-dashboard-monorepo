import type { KeystoneImage } from '@/types'
import type { Tag } from '@/components/dashboard/type'
// @twreporter
import type {
  MemberType,
  Constituency,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'

export type LegislatorBase = {
  name: string
  slug: string
  image?: KeystoneImage
  imageLink?: string
}

export type Legislator = {
  proposalSuccessCount?: number
  party: {
    name: string
    image?: KeystoneImage
    imageLink?: string
  }
  note?: string
  tooltip?: string
  legislativeMeeting: {
    term: number
  }
  constituency: string
  type: string
  sessionAndCommittee: {
    committee: {
      name: string
    }[]
    legislativeMeetingSession: {
      term: number
    }
  }[]
  legislator: LegislatorBase & {
    externalLink?: string
    meetingTermCount?: number
    meetingTermCountInfo?: string
  }
  isActive: boolean
}

export type LegislatorForDashboard = {
  id?: number
  name?: string
  slug: string
  avatar?: string
  partyAvatar?: string
  tooltip?: string
  note?: string
  count?: number
  tags?: Tag[]
  type?: MemberType
  constituency?: Constituency
}

export type LegislatorWithSpeechCount = {
  id: number
  slug: string
  name: string
  avatar: string
  partyAvatar: string
  count: number
}

export type LegislatorForIndex = {
  id: number
  legislator: LegislatorBase
  party: {
    image?: KeystoneImage
  }
  type?: MemberType
  constituency?: Constituency
  tootip?: string
  note?: string
}

export type LegislatorForFilter = LegislatorBase & {
  id: number
  count: number
}

export type LegislatorForLawmaker = {
  name: string
  slug: string
  constituency: string
  avatar: string
  party: {
    name: string
    image: string
  }
  tooltip?: string
  note?: string
  meetingTerm: number
  committees: {
    name: string
    count: number
  }[]
  proposalSuccessCount: number
  externalLink: string
  meetingTermCount: number
  meetingTermCountInfo: string
  isActive: boolean
}
