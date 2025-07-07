'use client'
import Head from 'next/head'
import styled from 'styled-components'
import { MouseEvent } from 'react'
// @twreporter
import EmptyState from '@twreporter/react-components/lib/empty-state'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
// utils
import { openFeedback } from '@/utils/feedback'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: ${colorGrayscale.gray100};
  padding-top: 72px;
  padding-bottom: 120px;
  justify-content: center;
  align-items: center;
`

const GuideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const P2Gray600 = styled(P2)`
  color: ${colorGrayscale.gray600};
`

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const errorTitle = '資料載入失敗'
const guideTextJsx = (
  <GuideContainer>
    <P2Gray600 text="我們正在努力解決中，請稍後再試一次。" />
    <P2Gray600 text="若持續發生錯誤，歡迎回報給我們！" />
  </GuideContainer>
)
const buttonText = '問題回報'
const Error: React.FC = () => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    openFeedback('SSR error')
  }
  return (
    <Container>
      <Head>
        <title>資料載入失敗</title>
      </Head>
      <EmptyState
        releaseBranch={releaseBranch}
        style={EmptyState.Style.PENCIL}
        title={errorTitle}
        showGuide={true}
        showButton={true}
        guide={guideTextJsx}
        buttonText={buttonText}
        buttonOnClick={handleClick}
      />
    </Container>
  )
}
export default Error
