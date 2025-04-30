import type { Meta, StoryObj } from '@storybook/react'

import PartyTag from '@/components/dashboard/card/party-tag'
import { TagSize } from '@/components/dashboard/enum'
import { TPP, KMT, DPP, TSP, NPP, NONE } from '@/components/sidebar/config'

const meta: Meta<typeof PartyTag> = {
  title: 'PartyTag',
  component: PartyTag,
  argTypes: {
    size: {
      control: 'radio',
      options: ['S', 'L'],
      mapping: {
        S: TagSize.S,
        L: TagSize.L,
      },
    },
    avatar: {
      control: 'radio',
      options: ['DPP', 'KMT', 'TPP', 'NPP', 'TSP', 'NONE'],
      mapping: {
        DPP,
        KMT,
        TPP,
        NPP,
        TSP,
        NONE,
      },
    },
  },
  parameters: {
    controls: {
      exclude: ['className'],
    },
  },
}
export default meta

type Story = StoryObj<typeof PartyTag>

const defaultArgs = {
  size: TagSize.L,
  avatar: DPP,
}

export const Basic: Story = { args: defaultArgs }
