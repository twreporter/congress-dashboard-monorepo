'use client'
import styled from 'styled-components'
// @twreporter
import EmptyState from '@twreporter/react-components/lib/empty-state'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

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

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const loadingTitle = '資料處理中，請稍候⋯⋯'
const guideText = '我們正在載入最新內容，很快就好！'
const Loading = () => {
  return (
    <Container>
      <EmptyState
        releaseBranch={releaseBranch}
        style={EmptyState.Style.UNDER_CONSTRUCTION}
        title={loadingTitle}
        showGuide={true}
        showButton={false}
        guide={guideText}
      />
    </Container>
  )
}
export default Loading
