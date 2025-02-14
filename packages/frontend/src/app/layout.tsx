'use client'

//import type { Metadata } from 'next'
import React from 'react'
import styled from 'styled-components'
import StyledComponentsRegistry from '@/lib/style-registry'
import { CoreContext } from '@/contexts'
// @twreporter
import {
  SnackBar,
  useSnackBar,
} from '@twreporter/react-components/lib/snack-bar'
import mq from '@twreporter/core/lib/utils/media-query'
import { BRANCH } from '@twreporter/core/lib/constants/release-branch'

/* todo
 *   add fonts
 *   add header, footer here
 *   add global styles
 */

/*
export const metadata: Metadata = {
  title: 'Twreporter Congress Dashboard',
  description: '報導者議會透視版',
}
  */

const SnackBarContainer = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: 8px;
  z-index: 1;
  transition: opacity 100ms ease-in-out;
  opacity: ${(props) => (props.$show ? 1 : 0)};
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
  const { showSnackBar, snackBarText, toastr } = useSnackBar()
  const contextValue = {
    releaseBranch: BRANCH.dev,
    toastr,
  }

  return (
    <html lang="zh-tw">
      <body>
        <StyledComponentsRegistry>
          <CoreContext.Provider value={contextValue}>
            <main>{children}</main>
            <SnackBarContainer $show={showSnackBar}>
              <SnackBar text={snackBarText} />
            </SnackBarContainer>
          </CoreContext.Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
