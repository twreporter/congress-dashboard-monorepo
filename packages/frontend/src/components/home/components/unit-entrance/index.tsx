'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
// components
import CongressCard from '@/components/home/components/unit-entrance/congress-card'
import CouncilCard from '@/components/home/components/unit-entrance/council-card'

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
  display: flex;
  flex-direction: column;
  gap: 24px;
`

// TODO: get council data from api
const councilData = [
  {
    title: '台北市議會',
    description: '第 14 屆',
    link: '/council/taipei',
    isExternal: false,
  },
  {
    title: '新北市議會',
    description: '第 12 屆',
    link: '/council/new-taipei',
    isExternal: false,
  },
  {
    title: '桃園市議會',
    description: '第 10 屆',
    link: '/council/taoyuan',
    isExternal: false,
  },
  {
    title: '台中市議會',
    description: '第 9 屆',
    link: '/council/taichung',
    isExternal: false,
  },
  {
    title: '高雄市議會',
    description: '第 10 屆',
    link: '/council/kaohsiung',
    isExternal: false,
  },
  {
    title: '台南市議會',
    description: '第 12 屆',
    link: '/council/tainan',
    isExternal: false,
  },
  {
    title: '金門縣議會',
    description: '第 2 屆',
    link: 'https://www.kmcc.gov.tw/',
    isExternal: true,
  },
]

const UnitEntrance: FC = () => {
  return (
    <Container>
      <TitleAndDescription>
        <Title text="立法院與縣市議會問政專輯" />
        <Description text="進入立法院或縣市議會首頁，查看議題、人物與發言紀錄" />
      </TitleAndDescription>
      <ListContainer>
        <CongressCard latestTerm={11} />
        <CouncilCard councilCount={19} councilData={councilData} />
      </ListContainer>
    </Container>
  )
}

export default UnitEntrance
