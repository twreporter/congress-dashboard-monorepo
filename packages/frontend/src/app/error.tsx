'use client'
import styled from 'styled-components'
// @twreporter
import EmptyState from '@twreporter/react-components/lib/empty-state'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
// utils
import { openFeedback } from '@/utils/feedback'

const ErrorContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: ${colorGrayscale.gray100};
  padding-top: 72px;
  padding-bottom: 120px;
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
const guideText = (
  <GuideContainer>
    <P2Gray600 text="我們正在努力解決中，請稍後再試一次。" />
    <P2Gray600 text="若持續發生錯誤，歡迎回報給我們！" />
  </GuideContainer>
)
const buttonText = '問題回報'
export default function Error() {
  const handleClick = (e) => {
    e.preventDefault()
    openFeedback()
  }
  return (
    <ErrorContainer>
      <title>資料載入失敗</title>
      <EmptyState
        releaseBranch={releaseBranch}
        style={EmptyState.Style.PENCIL}
        title={errorTitle}
        showGuide={true}
        showButton={true}
        guide={guideText}
        buttonText={buttonText}
        buttonOnclick={handleClick}
      />
    </ErrorContainer>
  )
}
