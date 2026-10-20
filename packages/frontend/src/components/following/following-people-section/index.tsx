'use client'
import React, { type FC, useState } from 'react'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import {
  TabletAndBelow,
  DesktopAndAbove,
} from '@twreporter/react-components/lib/rwd'
// components
import { FollowingPeopleCard } from '@/components/following/following-people-card'
import { SectionFilter } from '@/components/following/section-filter'
import { SectionPagination } from '@/components/following/section-pagination'
// constants
import {
  DEFAULT_FOLLOWING_SCOPE,
  matchesScope,
  type FollowingScope,
} from '@/components/following/constants'
// mock data
import { MOCK_PEOPLE_LIST } from '@/components/following/mock-data'

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

export const FollowingPeopleSection: FC = () => {
  const [scope, setScope] = useState<FollowingScope>(DEFAULT_FOLLOWING_SCOPE)
  const peopleList = MOCK_PEOPLE_LIST.filter((person) =>
    matchesScope(scope, person.type === 'councilor' ? 'local' : 'legislative')
  ).slice(0, 10)
  return (
    <Container>
      <CardSection>
        <CardWrapper>
          {peopleList.map((person) => {
            const type =
              person.type === 'councilor'
                ? FollowingPeopleCard.Type.COUNCILOR
                : FollowingPeopleCard.Type.LEGISLATOR
            return (
              <React.Fragment key={person.name}>
                <TabletAndBelow>
                  <FollowingPeopleCard
                    {...person}
                    type={type}
                    size={FollowingPeopleCard.Size.S}
                  />
                </TabletAndBelow>
                <DesktopAndAbove>
                  <FollowingPeopleCard
                    {...person}
                    type={type}
                    size={FollowingPeopleCard.Size.L}
                  />
                </DesktopAndAbove>
              </React.Fragment>
            )
          })}
        </CardWrapper>
        <Filter>
          <SectionFilter activeKey={scope} onChange={setScope} />
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
