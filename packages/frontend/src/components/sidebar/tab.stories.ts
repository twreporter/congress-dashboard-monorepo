import type { Meta, StoryObj } from '@storybook/react'

import Tab from '@/components/sidebar/tab'

const meta: Meta<typeof Tab> = {
  title: 'Sidebar/Tab',
  component: Tab,
  parameters: {
    controls: {
      exclude: ['onClick'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Tab>

export const Basic: Story = {
  args: {
    name: '項目分類',
    selected: false,
  },
}

export const WithImage: Story = {
  args: {
    name: '沈伯洋',
    imageLink:
      'https://dev-congress-dashboard-storage.twreporter.org/tmp/1.png', //todo: add storybook assets bucket or folder
    selected: false,
  },
}
