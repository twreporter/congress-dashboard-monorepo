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

type CongressIconProps = {
  // when omitted, the icon is small on tablet and below, large on desktop and above
  size?: IconSize
}

const CongressIcon: FC<CongressIconProps> = ({ size }) => {
  return (
    <Svg
      $size={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect width="36" height="36" rx="18" fill="#404040" />
      <path
        d="M14.6971 19.7424V15.0674H10.4805V25.7924M21.3029 19.7424V15.0674H25.5195V25.7924M13.6029 14.7931V13.0514H22.4029V15.0681M18 12.5V8.83333M18 8.83333V7L20.2917 7.91667V9.75L18 8.83333ZM10.4833 17.8174H7V25.7924H14.975M25.5167 17.8174H29V25.7924H21.025M13.6029 25.7902V19.7402H22.4029V25.7902H13.6029Z"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="white"
      />
    </Svg>
  )
}

export default CongressIcon
