'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import mq from '@twreporter/core/lib/utils/media-query'
// components
import CongressSection from '@/components/home/components/recent-focus/congress-section'
import CouncilSection from '@/components/home/components/recent-focus/council-section'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const TitleAndDescription = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled(H4)`
  color: ${colorGrayscale.gray800};
`

const Description = styled(P1)`
  color: ${colorGrayscale.gray700};
`

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  ${mq.tabletAndAbove`
    grid-template-columns: repeat(2, 1fr);
  `}
`

// TODO: use api data
const topicData = [
  {
    title: '馬太鞍溪堰塞湖潰壩',
    description: '發言數增加 155 筆（71人）',
    // 新進議題：前四個會期尚無資料，以 count: 0 補齊
    chartData: [
      { term: '11屆1會期', count: 0 },
      { term: '11屆2會期', count: 0 },
      { term: '11屆3會期', count: 0 },
      { term: '11屆4會期', count: 0 },
      { term: '11屆5會期', count: 155 },
    ],
  },
  {
    title: '健保補充保費改革',
    description: '發言數增加 42 筆（28人）',
    chartData: [
      { term: '11屆1會期', count: 12 },
      { term: '11屆2會期', count: 18 },
      { term: '11屆3會期', count: 15 },
      { term: '11屆4會期', count: 30 },
      { term: '11屆5會期', count: 42 },
    ],
  },
  {
    title: '核能電廠延役爭議',
    description: '發言數增加 67 筆（35人）',
    chartData: [
      { term: '11屆1會期', count: 20 },
      { term: '11屆2會期', count: 45 },
      { term: '11屆3會期', count: 38 },
      { term: '11屆4會期', count: 55 },
      { term: '11屆5會期', count: 67 },
    ],
  },
  {
    title: '最低工資調漲方案',
    description: '發言數持平，共 0 筆（0人）',
    // 故意設計成 5 筆數字全部為 0，測試圖表的置中水平線 fallback
    chartData: [
      { term: '11屆1會期', count: 0 },
      { term: '11屆2會期', count: 0 },
      { term: '11屆3會期', count: 0 },
      { term: '11屆4會期', count: 0 },
      { term: '11屆5會期', count: 0 },
    ],
  },
  {
    title: '長照 3.0 政策規劃',
    description: '發言數增加 28 筆（19人）',
    chartData: [
      { term: '11屆1會期', count: 50 },
      { term: '11屆2會期', count: 40 },
      { term: '11屆3會期', count: 35 },
      { term: '11屆4會期', count: 32 },
      { term: '11屆5會期', count: 28 },
    ],
  },
  {
    title: '數位身分證推行爭議',
    description: '發言數增加 90 筆（52人）',
    chartData: [
      { term: '11屆1會期', count: 5 },
      { term: '11屆2會期', count: 10 },
      { term: '11屆3會期', count: 60 },
      { term: '11屆4會期', count: 75 },
      { term: '11屆5會期', count: 90 },
    ],
  },
]
const councilData = [
  {
    title: '台北市 ✕ 敬老卡福利',
    description: '共 30 筆發言、12 筆議案（57人）',
  },
  { title: '新北市 ✕ 公共建設', description: '共 20 筆發言、8 筆議案（45人）' },
  {
    title: '台中市 ✕ 教育政策',
    description: '共 25 筆發言、10 筆議案（50人）',
  },
  { title: '高雄市 ✕ 交通建設', description: '共 15 筆發言、5 筆議案（40人）' },
  { title: '台南市 ✕ 環境保護', description: '共 10 筆發言、3 筆議案（30人）' },
  { title: '桃園市 ✕ 都市發展', description: '共 12 筆發言、4 筆議案（35人）' },
]

const RecentFocus: FC = () => {
  return (
    <Container>
      <TitleAndDescription>
        <Title text="近期熱門議題" />
        <Description text="查看近期立法院和六都議會中，哪些議題討論正在升溫" />
      </TitleAndDescription>
      <ListContainer>
        <CongressSection topicData={topicData} />
        <CouncilSection councilList={councilData} />
      </ListContainer>
    </Container>
  )
}

export default RecentFocus
