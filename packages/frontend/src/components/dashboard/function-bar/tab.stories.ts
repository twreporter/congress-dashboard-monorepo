import type { Meta, StoryObj } from '@storybook/react'

import Tab from '@/components/dashboard/function-bar/tab'

const meta: Meta<typeof Tab> = {
  title: 'Function Bar/Tab',
  component: Tab,
  parameters: {
    controls: {
      exclude: ['className'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Tab>

export const Basic: Story = {
  args: {
    text: '項目分類',
    selected: true,
  },
}
