import type { Meta, StoryObj } from '@storybook/react'

import Header from '@/components/header'

const meta: Meta<typeof Header> = {
  component: Header,
}
export default meta

type Story = StoryObj<typeof Header>

export const Basic: Story = {}
