import type { Meta, StoryObj } from '@storybook/react'

import RadioButton from '@/components/feedback/radio-button'

const meta: Meta<typeof RadioButton> = {
  title: 'Feedback/Radio Button',
  component: RadioButton,
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
}
export default meta

type Story = StoryObj<typeof RadioButton>

export const Basic: Story = {
  args: {
    checked: true,
    disabled: false,
    name: 'Chrome',
    value: 'chrome',
  },
}
