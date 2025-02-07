import React, { useState } from 'react'
import styled from 'styled-components'
// @twreporter
import { SnackBar } from '@twreporter/react-components/lib/snack-bar'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="currentColor"
  >
    <path
      d="M11 17.5H13V11.5H11V17.5ZM12 9.5C12.2833 9.5 12.5208 9.40417 12.7125 9.2125C12.9042 9.02083 13 8.78333 13 8.5C13 8.21667 12.9042 7.97917 12.7125 7.7875C12.5208 7.59583 12.2833 7.5 12 7.5C11.7167 7.5 11.4792 7.59583 11.2875 7.7875C11.0958 7.97917 11 8.21667 11 8.5C11 8.78333 11.0958 9.02083 11.2875 9.2125C11.4792 9.40417 11.7167 9.5 12 9.5ZM12 22.5C10.6167 22.5 9.31667 22.2375 8.1 21.7125C6.88333 21.1875 5.825 20.475 4.925 19.575C4.025 18.675 3.3125 17.6167 2.7875 16.4C2.2625 15.1833 2 13.8833 2 12.5C2 11.1167 2.2625 9.81667 2.7875 8.6C3.3125 7.38333 4.025 6.325 4.925 5.425C5.825 4.525 6.88333 3.8125 8.1 3.2875C9.31667 2.7625 10.6167 2.5 12 2.5C13.3833 2.5 14.6833 2.7625 15.9 3.2875C17.1167 3.8125 18.175 4.525 19.075 5.425C19.975 6.325 20.6875 7.38333 21.2125 8.6C21.7375 9.81667 22 11.1167 22 12.5C22 13.8833 21.7375 15.1833 21.2125 16.4C20.6875 17.6167 19.975 18.675 19.075 19.575C18.175 20.475 17.1167 21.1875 15.9 21.7125C14.6833 22.2375 13.3833 22.5 12 22.5ZM12 20.5C14.2333 20.5 16.125 19.725 17.675 18.175C19.225 16.625 20 14.7333 20 12.5C20 10.2667 19.225 8.375 17.675 6.825C16.125 5.275 14.2333 4.5 12 4.5C9.76667 4.5 7.875 5.275 6.325 6.825C4.775 8.375 4 10.2667 4 12.5C4 14.7333 4.775 16.625 6.325 18.175C7.875 19.725 9.76667 20.5 12 20.5Z"
      fill="currentColor"
    />
  </svg>
)

const Box = styled.div<{ $show: boolean }>`
  display: flex;
  flex-direction: column;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  position: relative;
  color: ${(props) =>
    props.$show ? colorGrayscale.gray800 : colorGrayscale.gray600};

  &:hover {
    color: ${colorGrayscale.gray800};
  }
`
const Detail = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 28px; // icon height(24) + 4
  left: -4px;
  width: max-content;
  ${(props) => (props.$show ? '' : 'display: none;')}
`

type TooltipProps = {
  tooltip: string
}
const Tooltip: React.FC<TooltipProps> = ({ tooltip }: TooltipProps) => {
  const [show, setShow] = useState(false)
  const toggleTooltip = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setShow(!show)
  }

  return (
    <Box onClick={toggleTooltip} $show={show}>
      <InfoIcon />
      <Detail $show={show}>
        <SnackBar text={tooltip} theme={SnackBar.THEME.normal} />
      </Detail>
    </Box>
  )
}
export default Tooltip
