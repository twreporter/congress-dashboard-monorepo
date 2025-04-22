import styled from 'styled-components'
// fonts
import { notoSerif } from '@/utils/font'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { H3 } from '@twreporter/react-components/lib/text/headline'
import { IconButton } from '@twreporter/react-components/lib/button'

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

export const Title = styled(H3)`
  color: ${colorGrayscale.gray900};
  font-family: ${notoSerif.style.fontFamily} !important;
`
