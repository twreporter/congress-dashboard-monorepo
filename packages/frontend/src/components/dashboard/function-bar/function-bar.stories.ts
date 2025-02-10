import type { Meta, StoryObj } from '@storybook/react'

import FunctionBar, { Option } from './index'

const meta: Meta<typeof FunctionBar> = {
  component: FunctionBar,
  argTypes: {
    currentTab: {
      control: 'radio',
      options: ['Issue', 'Legislator'],
      mapping: {
        Issue: Option.Issue,
        Legislator: Option.Human,
      },
    },
  },
  parameters: {
    controls: {
      exclude: ['setTab'],
    },
  },
}
export default meta

type Story = StoryObj<typeof FunctionBar>

export const functionBar: Story = {
  args: {
    filterString: '立法院｜第11屆｜全部會期',
    currentTab: Option.Issue,
  },
}
