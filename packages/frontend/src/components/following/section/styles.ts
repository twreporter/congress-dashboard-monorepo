'use client'
import styled from 'styled-components'
// @twreporter
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'

export const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-top: 32px;
  width: 100%;
  ${mq.tabletOnly`
    gap: 48px;
  `}
  ${mq.desktopAndAbove`
    padding-top: 40px;
    gap: 56px;
  `}
`

export const SectionTitle = styled(H4)`
  color: ${colorGrayscale.gray900};
`

export const SectionDescription = styled(P1)`
  color: ${colorGrayscale.gray700};
`

export const TabPlaceholder = styled(H4)`
  color: ${colorGrayscale.gray900};
  padding-top: 32px;
`
