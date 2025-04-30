import type { Meta, StoryObj } from '@storybook/react'
// @twreporter
import { MemberType } from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
// components
import Human, { CardSize } from '@/components/dashboard/card/human'
// type
import { Tag } from '@/components/dashboard/type'

const defaultTag: Tag[] = [
  { name: '人工智慧發展', count: 16 },
  { name: '國家科技發展', count: 12 },
  { name: '大學治理與人才培育', count: 9 },
  { name: '文化預算', count: 5 },
  { name: '藝文產業', count: 4 },
]
const mockHuman = {
  name: '沈伯洋',
  type: MemberType.NationwideAndOverseas,
  tags: defaultTag,
  avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1-L.png',
  partyAvatar:
    'https://dev-congress-dashboard-storage.twreporter.org/tmp/dpp.png',
}

const meta: Meta<typeof Human> = {
  title: 'Card/Human',
  component: Human,
  argTypes: {
    type: {
      control: 'radio',
      options: ['區域', '不分區', '山地原住民', '平地原住民'],
      mapping: {
        區域: MemberType.Constituency,
        不分區: MemberType.NationwideAndOverseas,
        山地原住民: MemberType.HighlandAboriginal,
        平地原住民: MemberType.LowlandAboriginal,
      },
    },
    size: {
      control: 'radio',
      options: ['S', 'L'],
      mapping: {
        S: CardSize.S,
        L: CardSize.L,
      },
    },
  },
  parameters: {
    controls: {
      exclude: ['tags', 'onClick'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Human>

const defaultArgs = {
  name: '沈伯洋',
  type: MemberType.NationwideAndOverseas,
  size: CardSize.L,
  avatar: mockHuman.avatar,
  partyAvatar: mockHuman.partyAvatar,
  selected: false,
}

export const Basic: Story = { args: { tags: mockHuman.tags, ...defaultArgs } }

export const WithNote: Story = {
  args: { note: "To be or not to be, that's the question", ...defaultArgs },
}
