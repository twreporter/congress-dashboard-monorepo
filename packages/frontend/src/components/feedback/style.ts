import styled from 'styled-components'
// @twreporter
import { H5 } from '@twreporter/react-components/lib/text/headline'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { PillButton } from '@twreporter/react-components/lib/button'

export const Box = styled.div`
  width: 100%;
`

export const TitleBlock = styled.div`
  display: flex;
  padding: 16px;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
`

export const OptionBlock = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`

export const ActionBlock = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px 24px;
  position: sticky;
  bottom: 0;
  background-color: white;
`

export const Title = styled(H5)`
  color: ${colorGrayscale.gray800};
`

export const ActionButton = styled(PillButton)`
  display: flex;
  width: 144px !important;
  align-items: center;
  justify-content: center;
`
