import type { Meta, StoryObj } from '@storybook/react'

import Search from '@/components/sidebar/filter-modal/search'

const meta: Meta<typeof Search> = {
  title: 'Sidebar/Filter Modal/Search',
  component: Search,
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
}
export default meta

type Story = StoryObj<typeof Search>

export const Basic: Story = {
  args: {
    placeholder: '篩選議題',
    onChange: (keyword) => {
      console.log(`search keyword: ${keyword}`)
    },
  },
}
