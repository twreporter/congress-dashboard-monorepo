'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'

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

const RecentFocus: FC = () => {
  return (
    <Container>
      <TitleAndDescription>
        <Title text="近期熱門議題" />
        <Description text="查看近期立法院和六都議會中，哪些議題討論正在升溫" />
      </TitleAndDescription>
    </Container>
  )
}

export default RecentFocus
