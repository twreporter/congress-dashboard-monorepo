import type { Meta, StoryObj } from '@storybook/react'

import Tab from './tab'

const meta: Meta<typeof Tab> = {
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
