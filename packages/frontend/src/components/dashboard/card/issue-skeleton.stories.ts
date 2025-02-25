import type { Meta, StoryObj } from '@storybook/react'

import { CardIssueSkeleton, CardSize } from '@/components/dashboard/card/issue'

const meta: Meta<typeof CardIssueSkeleton> = {
  component: CardIssueSkeleton,
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
}
export default meta

type Story = StoryObj<typeof CardIssueSkeleton>

const defaultArgs = {
  size: CardSize.L,
}

export const Basic: Story = { args: defaultArgs }
