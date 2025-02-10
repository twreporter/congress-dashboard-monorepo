import type { Meta, StoryObj } from '@storybook/react'

import { CardHumanSkeleton, CardSize } from './human'

const meta: Meta<typeof CardHumanSkeleton> = {
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
