import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'
import { MultipleSelect } from '@/components/selector'
import PartyTag from '@/components/dashboard/card/party-tag'
import { TagSize } from '@/components/dashboard/enum'

const OptionIcon = () => {
  return (
    <PartyTag
      size={TagSize.S}
      avatar="https://yt3.googleusercontent.com/ytc/AIdro_kG1AaurvqvdbbpAUW_PLMHeXf384dp8KX_stB4mHRVOQQ=s900-c-k-c0x00ffffff-no-rj"
    />
  )
}

const MultipleSelectWithState = (args) => {
  const [{ value }, updateArgs] = useArgs()

  const handleChange = (newValue) => {
    updateArgs({ value: newValue })
  }

  return <MultipleSelect {...args} value={value} onChange={handleChange} />
}

const meta: Meta<typeof MultipleSelect> = {
  title: 'Selector/MultipleSelect',
  component: MultipleSelect,
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      exclude: [
        'className',
        'defaultValue',
        'searchable',
        'searchPlaceholder',
        'placeholder',
        'enableAllOptionLogic',
      ],
    },
  },
  argTypes: {
    onChange: { action: 'changed' },
    options: { control: 'object' },
    value: { control: 'object' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    searchable: false,
    placeholder: '請選擇',
    maxDisplay: 3,
    enableAllOptionLogic: false,
  },
  render: MultipleSelectWithState,
}
export default meta

type Story = StoryObj<typeof MultipleSelect>

// Basic example with simple options
export const Basic: Story = {
  args: {
    value: ['1', '3'],
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
    ],
    disabled: false,
    loading: false,
  },
}

// Example with grouped options
export const GroupedOptions: Story = {
  args: {
    value: ['1-2', '2-1'],
    options: [
      {
        groupName: 'Group 1',
        options: [
          { label: 'Option 1-1', value: '1-1' },
          { label: 'Option 1-2', value: '1-2' },
        ],
      },
      {
        groupName: 'Group 2',
        options: [
          { label: 'Option 2-1', value: '2-1' },
          { label: 'Option 2-2', value: '2-2' },
        ],
      },
    ],
    disabled: false,
    loading: false,
  },
}

export const WithIconsOptions: Story = {
  args: {
    value: ['1'],
    options: [
      { label: 'Option 1', value: '1', prefixIcon: <OptionIcon /> },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
    ],
    disabled: false,
    loading: false,
  },
}

export const DefaultAllOptions: Story = {
  args: {
    value: ['all'],
    defaultValue: ['all'],
    options: [
      { label: '我要全部!', value: 'all', isDeletable: false },
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
    ],
    enableAllOptionLogic: true,
    disabled: false,
    loading: false,
  },
}

export const ShowError: Story = {
  args: {
    value: [],
    options: [],
    showError: true,
  },
}
