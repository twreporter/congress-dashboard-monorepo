'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
// components
import Open from '@/components/open'
import RecentFocus from '@/components/home/components/recent-focus'
import Activities from '@/components/home/components/activities'
import UnitEntrance from '@/components/home/components/unit-entrance'
// type
import type { EditorSelect } from '@/types/editor-pick'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 24px 80px 24px;
  width: 100%;
  gap: 48px;
  ${mq.tabletOnly`
    padding: 32px 32px 80px 32px;
    gap: 56px;
  `}
  ${mq.desktopAndAbove`
    padding: 48px 0 120px 0;
    width: 928px;
    margin: 0 auto;
    gap: 72px;
  `}
`

type HomeProps = {
  selecteds?: EditorSelect[]
}

export const Home: FC<HomeProps> = ({ selecteds }) => {
  return (
    <Container>
      <Open selecteds={selecteds} />
      <Content>
        <RecentFocus />
        <Activities />
        <UnitEntrance />
      </Content>
    </Container>
  )
}

export default Home
