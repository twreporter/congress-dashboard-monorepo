import styled from 'styled-components'
import Link from 'next/link'
// fonts
import { notoSerif } from '@/utils/font'
// @twreporter
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'\
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import { IconButton } from '@twreporter/react-components/lib/button'
import mq from '@twreporter/core/lib/utils/media-query'

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`

export const FlexRow = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
`

export const TitleGroup = styled(FlexRow)`
  padding-left: 24px;
`

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  gap: 8px;
`

export const Button = styled(IconButton)`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const Title = styled.span`
  line-height: 150%;
  font-size: 28px;
  font-weight: 700;
  ${mq.tabletAndBelow`
    font-size: 22px;
  `}
`

export const TitleLink = styled(Link)`
  text-decoration: none;
  color: ${colorSupportive.heavy};
  font-family: ${notoSerif.style.fontFamily} !important;
`

export const TitleText = styled.span`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`

export const P1Gray700 = styled(P1)`
  color: ${colorGrayscale.gray700};
`

export const P1Gray800Bold = styled(P1)`
  color: ${colorGrayscale.gray800};
  font-weight: 700;
`

export const SpanWithUnderline = styled.span`
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
`
