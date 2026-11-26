'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { H4, H5 } from '@twreporter/react-components/lib/text/headline'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import { Arrow } from '@twreporter/react-components/lib/icon'
import { TextButton } from '@twreporter/react-components/lib/button'
// components
import CongressIcon from '@/components/home/icons/congress'
import Chart from '@/components/home/components/recent-focus/chart'
// types
import type { ChartData } from '@/components/home/components/recent-focus/chart'
// utils
import { notoSerif } from '@/utils/font'
// constants
import { InternalRoutes } from '@/constants/routes'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0 4px 0;
  gap: 8px;
  border-radius: 4px;
  border: 1px solid ${colorOpacity['black_0.1']};
  background: ${colorGrayscale.white};
  box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
`

const TitleSection = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
`

const TitleAndIcon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

const Title = styled(H4)`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const List = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px 20px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: rgba(241, 241, 241, 0.5);
  }
`

const ListTitleAndDescription = styled.div`
  display: flex;
  flex-direction: column;
`

const ListTitle = styled(H5)`
  color: ${colorGrayscale.gray900};
`

const ListDescription = styled(P2)`
  color: ${colorGrayscale.gray800};
`

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

type CongressSectionProps = {
  topicData: Array<{
    title: string
    description: string
    chartData: ChartData
  }>
}
const CongressSection: FC<CongressSectionProps> = ({ topicData = [] }) => {
  const router = useRouter()
  const icon = (
    <Arrow direction={Arrow.Direction.RIGHT} releaseBranch={releaseBranch} />
  )
  return (
    <Container>
      <TitleSection>
        <TitleAndIcon>
          <CongressIcon />
          <Title text="立法院近期焦點" />
        </TitleAndIcon>
        <TextButton
          text="查看更多"
          rightIconComponent={icon}
          onClick={() => router.push(InternalRoutes.Congress)}
        />
      </TitleSection>
      <ListContainer>
        {topicData.map((topic, index) => (
          <List key={index}>
            <ListTitleAndDescription>
              <ListTitle text={topic.title} />
              <ListDescription text={topic.description} />
            </ListTitleAndDescription>
            <Chart chartData={topic.chartData} />
          </List>
        ))}
      </ListContainer>
    </Container>
  )
}
export default CongressSection
