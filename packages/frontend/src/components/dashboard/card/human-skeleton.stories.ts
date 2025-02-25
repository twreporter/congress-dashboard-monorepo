import type { Meta, StoryObj } from '@storybook/react'

import { CardHumanSkeleton, CardSize } from '@/components/dashboard/card/human'

const meta: Meta<typeof CardHumanSkeleton> = {
  title: 'Card/Human/Skeleton',
  component: CardHumanSkeleton,
  argTypes: {
    size: {
      control: 'radio',
      options: ['S', 'L'],
      mapping: {
        S: CardSize.S,
        L: CardSize.L,
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof CardHumanSkeleton>

const defaultArgs = {
  size: CardSize.L,
}

export const Basic: Story = { args: defaultArgs }
