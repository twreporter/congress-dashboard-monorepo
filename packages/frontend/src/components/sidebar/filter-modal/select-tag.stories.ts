import type { Meta, StoryObj } from '@storybook/react'

import SelectTag from '@/components/sidebar/filter-modal/select-tag'

const meta: Meta<typeof SelectTag> = {
  title: 'Sidebar/Filter Modal/Select Tag',
  component: SelectTag,
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
}
export default meta

type Story = StoryObj<typeof SelectTag>

export const Issue: Story = {
  args: {
    name: '議題標籤',
    count: 9,
  },
}

export const Legislator: Story = {
  args: {
    name: '立委姓名',
    count: 16,
    avatar: 'https://dev-congress-dashboard-storage.twreporter.org/tmp/1.png',
  },
}
