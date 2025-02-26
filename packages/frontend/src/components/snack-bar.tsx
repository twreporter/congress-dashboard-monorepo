'use client'

import React from 'react'
import styled from 'styled-components'
// constants
import { SNACK_BAR_ID } from '@/constants'
// @twreporter
import TwSnackBar from '@twreporter/react-components/lib/snack-bar/components/snack-bar'
import mq from '@twreporter/core/lib/utils/media-query'

const SnackBarContainer = styled.div`
  position: fixed;
  bottom: 8px;
  z-index: 1;
  transition: opacity 100ms ease-in-out;
  opacity: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  ${mq.desktopAndAbove`
    bottom: 24px;
  `}
  ${mq.tabletAndBelow`
    bottom: calc(env(safe-area-inset-bottom, 0) + 60px + 8px); // tab bar 60px
    padding: 0 16px;
  `}
  & > div {
    max-width: 440px;
    max-width: 100%;
  }
`

const SnackBar: React.FC = () => (
  <SnackBarContainer id={SNACK_BAR_ID}>
    <TwSnackBar />
  </SnackBarContainer>
)

export default SnackBar
