import type { Meta, StoryObj } from '@storybook/react'

import ToolTip from '@/components/dashboard/card/tooltip'

const meta: Meta<typeof ToolTip> = {
  title: 'ToolTip',
  component: ToolTip,
}
export default meta

type Story = StoryObj<typeof ToolTip>

export const Basic: Story = {
  args: {
    tooltip: '說明文案示意說明文案示意說明文案示意說明文案示意說明文案示意',
  },
}
