import type { Meta, StoryObj } from '@storybook/react'

import { MemberType } from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
import Human, { CardSize } from '@/components/dashboard/card/human'
import { mockHumans } from '@/components/dashboard/card/config'
const mockHuman = mockHumans[0]

const meta: Meta<typeof Human> = {
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
