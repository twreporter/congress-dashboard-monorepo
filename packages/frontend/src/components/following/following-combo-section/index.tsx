'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
// components
import { FollowingTopicCard } from '@/components/following/following-topic-card'
import { SectionFilter } from '@/components/following/section-filter'
import { SectionPagination } from '@/components/following/section-pagination'
// mock data
import { MOCK_COMBO_LIST } from '@/components/following/mock-data'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-top: 32px;
  ${mq.desktopAndAbove`
    gap: 64px;
    padding-top: 40px;
  `}
`

const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${mq.tabletAndAbove`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  `}
`

const Filter = styled.div`
  display: flex;
  justify-content: center;
`

export const FollowingComboSection: FC = () => {
  const peopleList = MOCK_COMBO_LIST.slice(0, 10)
  return (
    <Container>
      <CardSection>
        <CardWrapper>
          {peopleList.map((person, index) => (
            <FollowingTopicCard
              key={index}
              {...person}
              topicType={FollowingTopicCard.TopicType.COMBO}
              type={FollowingTopicCard.Type.LEGISLATIVE}
            />
          ))}
        </CardWrapper>
        <Filter>
          <SectionFilter />
        </Filter>
      </CardSection>
      <SectionPagination
        currentPage={1}
        totalPages={10}
        handleClickPrev={() => {}}
        handleClickNext={() => {}}
      />
    </Container>
  )
}
