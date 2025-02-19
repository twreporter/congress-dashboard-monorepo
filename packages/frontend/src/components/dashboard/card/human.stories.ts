import type { Meta, StoryObj } from '@storybook/react'

import { MemberType } from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
import Human, { CardSize } from './human'
import { mockHumans } from './config'
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
  tags: mockHuman.tags,
  avatar: mockHuman.avatar,
  partyAvatar: mockHuman.partyAvatar,
  selected: false,
}

export const Basic: Story = { args: defaultArgs }
