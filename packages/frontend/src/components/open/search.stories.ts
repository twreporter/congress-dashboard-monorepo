import type { Meta, StoryObj } from '@storybook/react'

import Search from '@/components/open/search'

const meta: Meta<typeof Search> = {
  title: 'Open/Search',
  component: Search,
}
export default meta

type Story = StoryObj<typeof Search>

export const Basic: Story = {}
