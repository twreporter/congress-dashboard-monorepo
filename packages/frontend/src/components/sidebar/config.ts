import { TitleSectionProps } from '@/components/sidebar/title-section'
import { SidebarIssueProps, SidebarLegislatorProps } from '@/components/sidebar'
import { mockLegislators } from '@/components/dashboard/card/config'
// lodash
import { fill } from 'lodash'
const _ = {
  fill,
}

const mockIssueList = [
  { name: '人工智慧發展', count: 16, slug: 'topic1' },
  { name: '萊豬進口', count: 12, slug: 'topic2' },
  { name: '疫苗取得與使用', count: 9, slug: 'topic3' },
  { name: '社區防疫管理', count: 5, slug: 'topic4' },
  { name: '防疫量能檢討', count: 4, slug: 'topic5' },
]

const mockLegislatorList = [
  {
    slug: 'chen-ming-wen',
    name: '沈伯洋',
    count: 16,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1.png',
  },
  {
    slug: 'huang-wei-che',
    name: '黃國昌',
    count: 9,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/2.png',
  },
  {
    slug: 'kao-chia-yu',
    name: '廖先翔',
    count: 5,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/3.png',
  },
  {
    slug: 'wang-yu-min',
    name: '吳思瑤',
    count: 4,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/4.png',
  },
  {
    slug: 'wu-chi-ming',
    name: '高金素梅',
    count: 2,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/5.png',
  },
]

export const mockSidebarIssueProps: SidebarIssueProps = {
  slug: 'topic1',
  title: 'NCC執法效能與正當性',
  count: 36,
  legislatorList: mockLegislatorList,
}

export const mockSidebarLegislatorProps: SidebarLegislatorProps = {
  slug: 'chen-ming-wen',
  title: '沈伯洋',
  subtitle: '本屆加入：程序委員會(6會期)、外交及國防委員會(2會期)',
  issueList: mockIssueList,
}

export const humanProps: TitleSectionProps = {
  link: '/legislators/chen-ming-wen',
  title: '沈伯洋',
  subtitle: '本屆加入：程序委員會(6會期)、外交及國防委員會(2會期)',
  tabs: mockLegislatorList,
}

export const issueProps: TitleSectionProps = {
  link: '/topic/topic1',
  title: 'NCC執法效能與正當性',
  count: 36,
  tabs: mockIssueList,
}

const mock2025Summary = {
  date: new Date('2025/12/07'),
  title: '行政院院長提出施政方針及施政報告並備質詢',
  summary:
    '沈伯洋的發言重點在於探討國科會對生命科學的重視與投入、生成式 AI 與人機介面的布局。他建議成立 AI 和 BCI 的法人，整合產學資源，推動臺灣科技發展。',
  slug: 'test-slug-1',
}
const mock2024Summary = {
  date: new Date('2024/03/05'),
  title: '行政院院長提出施政方針及施政報告並備質詢',
  summary:
    '沈伯洋的發言重點在於探討國科會對生命科學的重視與投入、生成式 AI 與人機介面的布局。他建議成立 AI 和 BCI 的法人，整合產學資源，推動臺灣科技發展。',
  slug: 'test-slug-1',
}

export function mockGetSummary(slug?: string) {
  console.log(`get mock summary for ${slug}`)
  return _.fill(Array(4), mock2025Summary).concat(
    _.fill(Array(3), mock2024Summary)
  )
}

export function mockGetIssue(slug?: string) {
  console.log(`get mock issue for ${slug}`)
  return mockIssueList
}

export function mockGetLegislator(slug?: string) {
  console.log(`get mock legislator for ${slug}`)
  return mockLegislators
}
