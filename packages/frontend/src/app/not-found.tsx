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
const notFoundTitle = '找不到這個頁面'
const guideText = '請返回首頁，試著搜尋其他內容'
const buttonText = '回首頁'
const buttonUrl = '/'
const NotFound: React.FC = () => {
  return (
    <Container>
      <EmptyState
        releaseBranch={releaseBranch}
        style={EmptyState.Style.DEFAULT}
        title={notFoundTitle}
        showGuide={true}
        showButton={true}
        guide={guideText}
        buttonText={buttonText}
        buttonUrl={buttonUrl}
      />
    </Container>
  )
}
export default NotFound
