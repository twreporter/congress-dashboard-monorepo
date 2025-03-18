import { Legislator, CardIssueProps } from '@/components/dashboard/card/issue'
import { CardHumanProps, Tag } from '@/components/dashboard/card/human'
import { MemberType } from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'

export const DPP =
  'https://dev-congress-dashboard-storage.twreporter.org/tmp/dpp.png'
export const KMT =
  'https://dev-congress-dashboard-storage.twreporter.org/tmp/kmt.png'
export const TPP =
  'https://dev-congress-dashboard-storage.twreporter.org/tmp/tpp.png'
export const NPP =
  'https://dev-congress-dashboard-storage.twreporter.org/tmp/npp.png'
export const TSP =
  'https://dev-congress-dashboard-storage.twreporter.org/tmp/tsp.png'
export const NONE =
  'https://dev-congress-dashboard-storage.twreporter.org/tmp/none.png'

export const mockLegislators: Legislator[] = [
  {
    name: '沈伯洋',
    count: 16,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1.png',
    partyAvatar: DPP,
    slug: 'test-1',
  },
  {
    name: '黃國昌',
    count: 9,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/2.png',
    partyAvatar: TPP,
    slug: 'test-2',
  },
  {
    name: '廖先翔',
    count: 5,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/3.png',
    partyAvatar: KMT,
    slug: 'test-3',
  },
  {
    name: '吳思瑤',
    count: 4,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/4.png',
    partyAvatar: DPP,
    slug: 'test-4',
  },
  {
    name: '高金素梅',
    count: 2,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/5.png',
    partyAvatar: NONE,
    slug: 'test-5',
  },
]

export const mockIssues: CardIssueProps[] = [
  {
    title: 'NCC執法效能與正當性',
    subTitle: '共 36 筆相關發言（5人）',
    legislators: mockLegislators.concat(mockLegislators),
  },
  {
    title: '人工智慧發展',
    subTitle: '共 32 筆相關發言（6人）',
    legislators: mockLegislators,
  },
  {
    title: '故宮經營狀況',
    subTitle: '共 30 筆相關發言（6人）',
    legislators: mockLegislators,
  },
  {
    title: '文化預算',
    subTitle: '共 29 筆相關發言（6人）',
    legislators: mockLegislators,
  },
  {
    title: '外交處境與進展',
    subTitle: '共 25 筆相關發言（5人）',
    legislators: mockLegislators,
  },
  {
    title: '居住正義',
    subTitle: '共 20 筆相關發言（5人）',
    legislators: mockLegislators,
  },
  {
    title: '美中台關係',
    subTitle: '共 20 筆相關發言（6人）',
    legislators: mockLegislators,
  },
  {
    title: '共軍戰略部署',
    subTitle: '共 19 筆相關發言（6人）',
    legislators: mockLegislators,
  },
  {
    title: '金融監理與壽險風險因應',
    subTitle: '共 19 筆相關發言（5人）',
    legislators: mockLegislators,
  },
  {
    title: '後備戰力改革',
    subTitle: '共 18 筆相關發言（5人）',
    legislators: mockLegislators,
  },
]

const defaultTag: Tag[] = [
  { name: '人工智慧發展', count: 16 },
  { name: '國家科技發展', count: 12 },
  { name: '大學治理與人才培育', count: 9 },
  { name: '文化預算', count: 5 },
  { name: '藝文產業', count: 4 },
]
export const mockHumans: CardHumanProps[] = [
  {
    name: '沈伯洋',
    type: MemberType.NationwideAndOverseas,
    tags: defaultTag,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: DPP,
  },
  {
    name: '沈伯洋',
    type: MemberType.Constituency,
    tags: defaultTag,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: KMT,
    tooltip: '我是藍色的',
  },
  {
    name: '沈伯洋',
    type: MemberType.HighlandAboriginal,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: TPP,
    note: '我的名字叫 PUMA，喜歡黑熊。',
  },
  {
    name: '沈伯洋',
    type: MemberType.LowlandAboriginal,
    tags: defaultTag,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: NONE,
  },
  {
    name: '沈伯洋',
    type: MemberType.NationwideAndOverseas,
    tags: defaultTag,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: NPP,
  },
  {
    name: '沈伯洋',
    type: MemberType.NationwideAndOverseas,
    tags: defaultTag,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: TSP,
  },
  {
    name: '沈伯洋',
    type: MemberType.NationwideAndOverseas,
    tags: defaultTag,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: DPP,
  },
  {
    name: '沈伯洋',
    type: MemberType.NationwideAndOverseas,
    tags: defaultTag,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: DPP,
  },
  {
    name: '沈伯洋',
    type: MemberType.NationwideAndOverseas,
    tags: defaultTag,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: DPP,
  },
  {
    name: '沈伯洋',
    type: MemberType.NationwideAndOverseas,
    tags: defaultTag,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: DPP,
  },
  {
    name: '沈伯洋',
    type: MemberType.NationwideAndOverseas,
    tags: defaultTag,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: DPP,
  },
  {
    name: '沈伯洋',
    type: MemberType.NationwideAndOverseas,
    tags: defaultTag,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
    partyAvatar: DPP,
  },
]
