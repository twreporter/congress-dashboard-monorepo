import type { Meta, StoryObj } from '@storybook/react'

import { SummaryCard as Card } from '@/components/sidebar/card'

const meta: Meta<typeof Card> = {
  title: 'Sidebar/Summary Card',
  component: Card,
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
}
export default meta

type Story = StoryObj<typeof Card>

export const Basic: Story = {
  args: {
    date: new Date('2025/12/07'),
    title: '行政院院長提出施政方針及施政報告並備質詢',
    summary:
      '沈伯洋的發言重點在於探討國科會對生命科學的重視與投入、生成式 AI 與人機介面的布局。他建議成立 AI 和 BCI 的法人，整合產學資源，推動臺灣科技發展。',
    slug: 'test-slug-1',
  },
}

export const Long: Story = {
  args: {
    date: new Date('2025/10/26'),
    title:
      '邀請國家科學及技術委員會主任委員吳誠文、數位發展部列席就「人工智慧 (AI) 推動現況與未來方向」進行專題報告，並備質詢',
    summary:
      '沈伯洋提及生成式 AI 的發展對電力需求的影響，以及臺灣的能源配比問題，並關注工業用電漲幅對產業的影響。此外，他強調人工智慧基本法的必要性，要求在今年年底前提出立法草案，并希望國科會在生成式 AI 的應用上有所行動。',
    slug: 'long-title-slug',
  },
}
