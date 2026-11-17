'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'

export enum IconSize {
  SMALL = 'small',
  LARGE = 'large',
}

const SIZE_IN_PX = {
  [IconSize.SMALL]: 32,
  [IconSize.LARGE]: 36,
}

const Svg = styled.svg<{ $size?: IconSize }>`
  width: ${(props) => SIZE_IN_PX[props.$size ?? IconSize.SMALL]}px;
  height: ${(props) => SIZE_IN_PX[props.$size ?? IconSize.SMALL]}px;

  ${(props) =>
    props.$size
      ? ''
      : mq.desktopAndAbove`
          width: ${SIZE_IN_PX[IconSize.LARGE]}px;
          height: ${SIZE_IN_PX[IconSize.LARGE]}px;
        `}
`

type CouncilIconProps = {
  // when omitted, the icon is small on tablet and below, large on desktop and above
  size?: IconSize
}

const CouncilIcon: FC<CouncilIconProps> = ({ size }) => {
  return (
    <Svg
      $size={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect width="36" height="36" rx="18" fill="#C09662" />
      <path
        d="M12.1667 11.7778H11.0556L18 6.5L24.6667 11.7778H23.8333M12.1667 11.7778V14M12.1667 11.7778H23.8333M12.1667 14H8V26.5H13M12.1667 14H13M23.8333 11.7778V14M23.8333 14H23M23.8333 14H28V26.5H23M13 14H15.5M13 14V17.3333M13 26.5H15.5M13 26.5V17.3333M23 14H20.5M23 14V17.3333M23 26.5H20.5M23 26.5V17.3333M20.5 14H18M20.5 14V17.3333M20.5 26.5H18M20.5 26.5V22.8889M15.5 14H18M15.5 14V17.3333M15.5 26.5H18M15.5 26.5V22.8889M13 17.3333H15.5M23 17.3333H20.5M15.5 17.3333H18M15.5 17.3333V22.8889M18 17.3333H20.5M18 17.3333V14M18 17.3333V22.8889M20.5 17.3333V22.8889M18 26.5V22.8889M18 22.8889H15.5M18 22.8889H20.5"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="white"
      />
    </Svg>
  )
}

export default CouncilIcon
