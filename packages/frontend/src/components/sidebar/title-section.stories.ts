import type { Meta, StoryObj } from '@storybook/react'

import TitleSection from '@/components/sidebar/title-section'
import { humanProps, issueProps } from '@/components/sidebar/config'

const meta: Meta<typeof TitleSection> = {
  title: 'Sidebar/Title Section',
  component: TitleSection,
}
export default meta

type Story = StoryObj<typeof TitleSection>

export const Issue: Story = { args: issueProps }
export const Legilative: Story = { args: humanProps }
