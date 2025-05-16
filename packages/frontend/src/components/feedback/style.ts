import styled, { css } from 'styled-components'
// @twreporter
import { H5 } from '@twreporter/react-components/lib/text/headline'
import {
  colorGrayscale,
  COLOR_SEMANTIC,
} from '@twreporter/core/lib/constants/color'
import { PillButton } from '@twreporter/react-components/lib/button'
import mq from '@twreporter/core/lib/utils/media-query'

export const Box = styled.div`
  width: 100%;

  ${mq.mobileOnly`
    height: 100%;  
  `}
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
  align-items: center;
  gap: 24px;

  ${mq.mobileOnly`
    padding: 24px;
    gap: 20px;
  `}
`

export const ActionBlock = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px 24px;
  position: sticky;
  bottom: 0;
  background-color: white;

  ${mq.mobileOnly`
    padding: 24px;
    gap: 10px;
    top: calc(100vh - 90px);
  `}
`

export const Title = styled(H5)`
  color: ${colorGrayscale.gray800};
`

export const ActionButton = styled(PillButton)`
  display: flex;
  align-items: center;
  justify-content: center;

  ${mq.tabletAndAbove`
      width: 144px !important;
  `}

  ${mq.mobileOnly`
    flex: 1;
  `}
`

export const inputCss = css<{
  $isError?: boolean
  disabled?: boolean
}>`
  border-radius: 4px;
  font-size: 16px;
  line-height: 150%;
  outline: none;

  ::placeholder {
    color: ${colorGrayscale.gray500};
  }

  ${(props) =>
    props.disabled
      ? `
    border: 1px solid ${colorGrayscale.gray300};
    background-color: ${colorGrayscale.gray100};
  `
      : props.$isError
      ? `
    border: 1px solid ${COLOR_SEMANTIC.danger};
    background-color: ${colorGrayscale.white};
  `
      : `
    border: 1px solid ${colorGrayscale.gray300};
    background-color: ${colorGrayscale.white};

    &:hover, &:focus-visible, &:active {
      border: 1px solid ${colorGrayscale.gray600};
      outline: none;
    }
  `}
`
