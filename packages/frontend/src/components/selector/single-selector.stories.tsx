import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'
import { SingleSelect } from '@/components/selector'

const OptionIcon = () => {
  return (
    <img
      style={{ width: '16px', height: '16px' }}
      src={
        'https://yt3.googleusercontent.com/ytc/AIdro_kG1AaurvqvdbbpAUW_PLMHeXf384dp8KX_stB4mHRVOQQ=s900-c-k-c0x00ffffff-no-rj'
      }
      alt=""
    />
  )
}

const SingleSelectWithState = (args) => {
  const [{ value }, updateArgs] = useArgs()

  const handleChange = (newValue) => {
    updateArgs({ value: newValue })
  }

  return <SingleSelect {...args} value={value} onChange={handleChange} />
}

const meta: Meta<typeof SingleSelect> = {
  title: 'Selector/SingleSelect',
  component: SingleSelect,
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
      ],
    },
  },
  argTypes: {
    onChange: { action: 'changed' },
    options: { control: 'object' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    searchable: false,
    placeholder: '請選擇',
  },
  render: SingleSelectWithState,
}
export default meta

type Story = StoryObj<typeof SingleSelect>

export const Basic: Story = {
  args: {
    value: '1',
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
    value: '2-1',
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
    value: '1',
    options: [
      { label: 'Option 1', value: '1', prefixIcon: <OptionIcon /> },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
    ],
    disabled: false,
    loading: false,
  },
}
