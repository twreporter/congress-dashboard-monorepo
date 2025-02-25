import React from 'react'
import type { Metadata } from 'next'
// lib
import StyledComponentsRegistry from '@/lib/style-registry'
import { notoSans } from '@/lib/font'
// components
import SnackBar from '@/components/snack-bar'

export const metadata: Metadata = {
  title: 'Twreporter Congress Dashboard',
  description: '報導者議會透視版',
}

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
          <SnackBar />
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
