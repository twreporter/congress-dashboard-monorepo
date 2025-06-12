import styled from 'styled-components'
import Link from 'next/link'
// fonts
import { notoSerif } from '@/utils/font'
// @twreporter
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
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
