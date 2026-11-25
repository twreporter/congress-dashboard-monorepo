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
import CongressIcon from '@/components/home/icons/congress'
// constants
import { InternalRoutes } from '@/constants/routes'

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

const Term = styled(P2)`
  color: ${colorGrayscale.gray800};
`

const ListSection = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  width: 100%;
  ${mq.tabletAndAbove`
    grid-template-columns: repeat(2, 1fr);
  `}
`

type CongressCardProps = {
  latestTerm: number
}
const CongressCard: FC<CongressCardProps> = ({ latestTerm }) => {
  return (
    <Container>
      <HeaderSection>
        <IconAndTitle>
          <Icon>
            <CongressIcon />
          </Icon>
          <Title text="地方議會" />
        </IconAndTitle>
        <Term text={`第 ${latestTerm} 屆`} />
      </HeaderSection>
      <ListSection>
        <InternalLink
          href={InternalRoutes.Congress}
          title="看議題"
          description="查看各公共議題的相關討論"
        />
        <InternalLink
          href={`${InternalRoutes.Congress}?tab=legislator`}
          title="看立委"
          description="查看立委的關注議題與發言紀錄"
        />
      </ListSection>
    </Container>
  )
}

export default CongressCard
