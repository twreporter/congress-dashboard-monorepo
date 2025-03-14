import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Cross } from '@twreporter/react-components/lib/icon'
import CustomPillButton, { CustomPillButtonProps } from './pill-button'

type CustomPillButtonStoryProps = CustomPillButtonProps & {
  showLeft?: boolean
  showRight?: boolean
}

const WithIconDisplay = (args: CustomPillButtonStoryProps) => {
  const leftIconComponent = args.showLeft ? <Cross /> : null
  const rightIconComponent = args.showRight ? <Cross /> : null

  return (
    <CustomPillButton
      leftIconComponent={leftIconComponent}
      rightIconComponent={rightIconComponent}
      {...args}
    />
  )
}

const meta: Meta<CustomPillButtonStoryProps> = {
  title: 'Components/Button/PillButton',
  component: CustomPillButton,
  parameters: {
    controls: {
      exclude: ['leftIconComponent', 'rightIconComponent'],
    },
  },
  argTypes: {
    text: { control: 'text' },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    showLeft: {
      control: 'boolean',
    },
    showRight: {
      control: 'boolean',
    },
  },
  render: WithIconDisplay,
}

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    text: 'PillButton',
    showLeft: true,
    showRight: true,
    isLoading: false,
    disabled: false,
  },
}
