import type { Meta, StoryObj } from '@storybook/react'

import TitleSection, {
  type TitleSectionProps,
} from '@/components/sidebar/title-section'
import { mockLegislators, mockIssueList } from '@/components/sidebar/config'

const humanProps: TitleSectionProps = {
  link: '/legislators/chen-ming-wen',
  title: '沈伯洋',
  subtitle: '本屆加入：程序委員會(6會期)、外交及國防委員會(2會期)',
  tabs: mockLegislators,
  showTabAvatar: true,
}

const issueProps: TitleSectionProps = {
  link: '/topic/topic1',
  title: 'NCC執法效能與正當性',
  count: 36,
  tabs: mockIssueList,
  showTabAvatar: false,
}

const meta: Meta<typeof TitleSection> = {
  title: 'Sidebar/Title Section',
  component: TitleSection,
}
export default meta

type Story = StoryObj<typeof TitleSection>

export const Issue: Story = { args: issueProps }
export const Legilative: Story = { args: humanProps }
