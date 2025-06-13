import styled from 'styled-components'
// @twreporter
import {
  COLOR_SEMANTIC,
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { P1, P2, P3 } from '@twreporter/react-components/lib/text/paragraph'
import { Arrow, Cross } from '@twreporter/react-components/lib/icon'

export const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`

export const SelectBox = styled.div<{
  $disabled: boolean
  $focused: boolean
  $error?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid
    ${(props) =>
      props.$disabled
        ? colorGrayscale.gray300
        : props.$error
        ? COLOR_SEMANTIC.danger
        : props.$focused
        ? colorGrayscale.gray600
        : colorGrayscale.gray300};
  border-radius: 4px;
  background-color: ${(props) =>
    props.$disabled ? colorGrayscale.gray100 : colorGrayscale.white};
  padding: 8px 12px;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  height: 48px;
  box-sizing: border-box;
  gap: 8px;

  &:hover {
    border-color: ${(props) =>
      !props.$disabled &&
      !props.$focused &&
      !props.$error &&
      colorGrayscale.gray600};
  }
`

export const SelectBoxContent = styled.div<{ $disabled: boolean }>`
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'all')};
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  gap: 8px;
`

export const Placeholder = styled(P1)`
  color: ${colorGrayscale.gray500};
`

export const SelectedLabel = styled(P1)`
  color: ${colorGrayscale.gray800};
`

export const DropdownMenuContainer = styled.div<{ $showAbove?: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 264px;
  overflow-y: auto;
  background: ${colorGrayscale.white};
  border-radius: 4px;
  margin-top: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  box-shadow: 0px 2px 16px 0px ${colorOpacity['black_0.2']};
  z-index: 10;
  ${(props) =>
    props.$showAbove
      ? `
      top: auto;
      bottom: 100%;
      margin-top: 0;
      margin-bottom: 8px;
      `
      : ''}/* TODO: scroll bar */
`

export const OptionItem = styled.div<{
  $selected: boolean
  $isIndent?: boolean
}>`
  width: inherit;
  height: 40px;
  padding: ${(props) => (props.$isIndent ? '8px 12px 8px 20px' : '8px 12px')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => (props.$selected ? '#F0D5BE80' : 'white')};
  gap: 10px;

  &:hover {
    background-color: ${colorGrayscale.gray100};
  }
`

export const OptionItemGroupName = styled(P2)`
  padding: 8px 12px;
  color: ${colorGrayscale.gray600};
`

export const OptionItemLabel = styled(P1)`
  flex: 1;
  color: ${colorGrayscale.gray800};
`

export const OptionItemPrefixIcon = styled.div`
  display: flex;
  height: 16px;
  width: 16px;
`

export const Tag = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colorOpacity['black_0.05']};
  border-radius: 4px;
  padding: 2px 8px;
  height: 32px;
  gap: 6px;
`

export const TagLabel = styled(P2)`
  display: inline-block !important;
  color: ${colorGrayscale.gray800};
  max-width: 70px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const TagCloseIcon = styled(Cross)`
  cursor: pointer;
  height: 16px !important;
  width: 16px !important;
  padding: 4px;
  background-color: ${colorGrayscale.gray500} !important;

  &:hover {
    background-color: ${colorGrayscale.gray800} !important;
  }
`

export const CheckMark = styled.div`
  height: 24px;
  width: 24px;
`

export const LoadingIndicator = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 48px;

  &:after {
    content: '';
    width: 24px;
    height: 24px;
    border: 2px solid ${colorGrayscale.gray400};
    border-top-color: ${colorGrayscale.gray600};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const ArrowIcon = styled(Arrow)<{ $isDropdownOpen: boolean }>`
  width: 24px;
  height: 24px;
  transition: transform 0.2s;
  transform: ${(props) =>
    props.$isDropdownOpen ? 'rotate(270deg)' : 'rotate(90deg)'};
  background-color: ${colorGrayscale.gray600} !important;
`

export const SearchText = styled(P1)`
  flex: 1;
  color: ${colorGrayscale.gray800};
`
export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  width: 100%;

  &::placeholder {
    color: ${colorGrayscale.gray500};
  }
`

export const NoResults = styled.div`
  padding: 12px 16px;
  color: ${colorGrayscale.gray800};
  text-align: center;
`

export const ErrorMsgBox = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  justify-contents: center;
  aliign-items: center;
`

export const ErrorMsg = styled(P3)`
  color: ${COLOR_SEMANTIC.danger};
`

export const SpanWithUnderline = styled.span`
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
`
