import type { Meta, StoryObj } from '@storybook/react'
import IconButton from './icon-button'

const meta: Meta<typeof IconButton> = {
  title: 'Components/Button/IconButton',
  component: IconButton,
  argTypes: {
    direction: { control: 'radio', options: ['left', 'right'] },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
  parameters: {
    controls: {
      exclude: ['onClick'],
    },
  },
}
export default meta

type Story = StoryObj<typeof IconButton>

export const Basic: Story = {
  args: {
    direction: 'left',
    isLoading: false,
    disabled: false,
  },
}
