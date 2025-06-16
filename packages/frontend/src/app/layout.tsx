import React from 'react'
import type { Metadata } from 'next'
// utils
import StyledComponentsRegistry from '@/utils/style-registry'
import { notoSans } from '@/utils/font'
// style
import GlobalStyles from '@/styles/global-styles'
// component
import Header from '@/components/header'
import Footer from '@/components/footer'
import SnackBar from '@/components/snack-bar'
import Feedback from '@/components/feedback'
// context
import { ScrollProvider } from '@/contexts/scroll-context'
// constants
import { OG_IMAGE_URL } from '@/constants'

export const metadata: Metadata = {
  title: '報導者觀測站：一起監督立委議員問政',
  description:
    '你家立委正在關心什麼議題、質詢哪些官員？《報導者》用人工智慧技術分析上億字逐字稿，和你一起追蹤立委的發言紀錄與問政焦點。',
  alternates: {
    canonical: 'https://lawmaker.twreporter.org',
  },
  openGraph: {
    title: '報導者觀測站：一起監督立委議員問政',
    url: 'https://lawmaker.twreporter.org',
    type: 'website',
    images: OG_IMAGE_URL,
    description:
      '你家立委正在關心什麼議題、質詢哪些官員？《報導者》用人工智慧技術分析上億字逐字稿，和你一起追蹤立委的發言紀錄與問政焦點。',
  },
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
          <ScrollProvider>
            <GlobalStyles />
            <Header />
            <Feedback />
            <main>{children}</main>
            <Footer />
          </ScrollProvider>
          <SnackBar />
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
