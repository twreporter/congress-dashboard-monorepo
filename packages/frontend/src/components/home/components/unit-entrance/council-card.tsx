'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import mq from '@twreporter/core/lib/utils/media-query'
// utils
import { notoSerif } from '@/utils/font'
// components
import InternalLink from '@/components/home/components/internal-link'
import ExternalLink from '@/components/home/components/external-link'
import CouncilIcon from '@/components/home/icons/council'
import Tooltip from '@/components/dashboard/card/tooltip'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid ${colorOpacity['black_0.1']};
  background: ${colorGrayscale.white};
  gap: 20px;
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const IconAndTitle = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`

const Icon = styled.div`
  display: flex;
`

const Title = styled(H4)`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`

const CountAndInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`

const CouncilCount = styled(P2)`
  color: ${colorGrayscale.gray800};
`

const ListSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  ${mq.tabletOnly`
    grid-template-columns: repeat(4, 1fr);
  `}
  ${mq.desktopAndAbove`
    grid-template-columns: repeat(5, 1fr);
  `}
`

type CouncilCardProps = {
  councilCount: number
  councilData: {
    title: string
    description: string
    link: string
    isExternal: boolean
  }[]
}
const CouncilCard: FC<CouncilCardProps> = ({ councilCount, councilData }) => {
  const tooltipText =
    '各縣市議會資料開放程度不一，部分縣市資料整理中，目前僅提供原始資料來源。'
  return (
    <Container>
      <HeaderSection>
        <IconAndTitle>
          <Icon>
            <CouncilIcon />
          </Icon>
          <Title text="地方議會" />
        </IconAndTitle>
        <CountAndInfo>
          <CouncilCount text={`目前開放 ${councilCount} 個議會`} />
          <Tooltip tooltip={tooltipText} />
        </CountAndInfo>
      </HeaderSection>
      <ListSection>
        {councilData.map((council, index) =>
          council.isExternal ? (
            <ExternalLink
              key={index}
              href={council.link}
              title={council.title}
              description={council.description}
            />
          ) : (
            <InternalLink
              key={index}
              href={council.link}
              title={council.title}
              description={council.description}
            />
          )
        )}
      </ListSection>
    </Container>
  )
}

export default CouncilCard
