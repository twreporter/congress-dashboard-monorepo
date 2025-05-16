import type { Meta, StoryObj } from '@storybook/react'

import SelectCard from '@/components/feedback/select-card'

const meta: Meta<typeof SelectCard> = {
  title: 'Feedback/Select Card',
  component: SelectCard,
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
}
export default meta

type Story = StoryObj<typeof SelectCard>

export const Basic: Story = {
  args: {
    checked: true,
    disabled: false,
    name: 'Chrome',
    value: 'chrome',
    title: '標題',
    description: '內容描述文案',
  },
}
