import type { Meta, StoryObj } from '@storybook/react'

import Issue, { CardSize } from './issue'
import { mockLegislators } from './config'

const meta: Meta<typeof Issue> = {
  component: Issue,
  argTypes: {
    size: {
      control: 'radio',
      options: ['S', 'M', 'L'],
      mapping: {
        S: CardSize.S,
        M: CardSize.M,
        L: CardSize.L,
      },
    },
  },
  parameters: {
    controls: {
      exclude: ['legislators', 'onClick'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Issue>

const defaultArgs = {
  title: 'NCC執法效能與正當性',
  subTitle: '共 36 筆相關發言',
  legislators: mockLegislators,
  size: CardSize.L,
  selected: false,
}

export const Basic: Story = { args: defaultArgs }
