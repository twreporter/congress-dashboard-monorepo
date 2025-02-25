import type { Meta, StoryObj } from '@storybook/react'

import Open from '@/components/open'

const meta: Meta<typeof Open> = {
  title: 'Open',
  component: Open,
}
export default meta

type Story = StoryObj<typeof Open>

export const Basic: Story = {}
