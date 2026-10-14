'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
// components
import { FollowingArticleCard } from '@/components/following/following-article-card'
import { SectionPagination } from '@/components/following/section-pagination'
// mock data
import { MOCK_BILL_LIST } from '@/components/following/mock-data'

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

export const FollowingBillSection: FC = () => {
  const billList = MOCK_BILL_LIST.slice(0, 10)
  return (
    <Container>
      <CardSection>
        <CardWrapper>
          {billList.map((bill, index) => (
            <FollowingArticleCard
              key={index}
              {...bill}
              type={FollowingArticleCard.Type.BILL}
            />
          ))}
        </CardWrapper>
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
