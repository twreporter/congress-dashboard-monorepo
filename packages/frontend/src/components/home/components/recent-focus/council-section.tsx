'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { H4, H5 } from '@twreporter/react-components/lib/text/headline'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import { Arrow } from '@twreporter/react-components/lib/icon'
// components
import CouncilIcon from '@/components/home/icons/council'
// utils
import { notoSerif } from '@/utils/font'

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
  gap: 8px;
  padding: 0 20px;
  align-items: center;
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

const ArrowIcon = styled(Arrow)`
  background-color: ${colorGrayscale.gray600} !important;
`

type CouncilSectionProps = {
  councilList: Array<{
    title: string
    description: string
  }>
}
const CouncilSection: FC<CouncilSectionProps> = ({ councilList = [] }) => {
  return (
    <Container>
      <TitleSection>
        <CouncilIcon />
        <Title text="六都議會近期焦點" />
      </TitleSection>
      <ListContainer>
        {councilList.map((councilItem, index) => (
          <List key={index}>
            <ListTitleAndDescription>
              <ListTitle text={councilItem.title} />
              <ListDescription text={councilItem.description} />
            </ListTitleAndDescription>
            <ArrowIcon />
          </List>
        ))}
      </ListContainer>
    </Container>
  )
}
export default CouncilSection
