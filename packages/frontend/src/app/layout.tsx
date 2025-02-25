import React from 'react'
import styled from 'styled-components'
import type { Metadata } from 'next'
// lib
import StyledComponentsRegistry from '@/lib/style-registry'
import { notoSans } from '@/lib/font'
// constants
import { SNACK_BAR_ID, SNACK_BAR_TEXT_ID } from '@/constants'
// @twreporter
import SnackBar from '@twreporter/react-components/lib/snack-bar/components/snack-bar'
import mq from '@twreporter/core/lib/utils/media-query'

export const metadata: Metadata = {
  title: 'Twreporter Congress Dashboard',
  description: '報導者議會透視版',
}

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-tw" className={notoSans.className}>
      <body>
        <StyledComponentsRegistry>
          <main>{children}</main>
          <SnackBarContainer id={SNACK_BAR_ID}>
            <SnackBar id={SNACK_BAR_TEXT_ID} />
          </SnackBarContainer>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
