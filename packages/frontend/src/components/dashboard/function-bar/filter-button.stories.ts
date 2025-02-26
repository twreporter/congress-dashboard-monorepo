import type { Meta, StoryObj } from '@storybook/react'

import { FilterButton } from '@/components/dashboard/function-bar'

const meta: Meta<typeof FilterButton> = {
  title: 'Function Bar/FilterButton',
  component: FilterButton,
  parameters: {
    controls: {
      exclude: ['className'],
    },
  },
}
export default meta

type Story = StoryObj<typeof FilterButton>

export const Basic: Story = {
  args: {
    filterCount: 10,
  },
}
