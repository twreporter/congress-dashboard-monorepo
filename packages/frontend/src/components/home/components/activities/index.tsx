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

const Activities: FC = () => {
  return (
    <Container>
      <TitleAndDescription>
        <Title text="立委／議員問政動態" />
        <Description text="查看特定立委／議員的背景與問政表現，觀察他關注的議題有哪些" />
      </TitleAndDescription>
    </Container>
  )
}

export default Activities
