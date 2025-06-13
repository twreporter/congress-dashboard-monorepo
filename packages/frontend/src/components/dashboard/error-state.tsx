import React, { FC } from 'react'
import styled from 'styled-components'
// util
import { openFeedback } from '@/utils/feedback'
// @twreporter
import EmptyState from '@twreporter/react-components/lib/empty-state'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const Box = styled.div`
  padding: 72px 0 120px 0;
  width: 100%;
  display: flex;
  justify-content: center;
`
const Text = styled(P2)`
  color: ${colorGrayscale.gray800};
  text-align: center;
  display: flex;
  flex-direction: column;
`
const TextWithUnderline = styled.span`
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
`

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const ErrorState: FC = () => {
  const guideJsx = (
    <Text>
      <span>請嘗試重新整理頁面。若仍無法正常顯示，</span>
      <span>
        歡迎點此
        <TextWithUnderline onClick={openFeedback}>回報問題</TextWithUnderline>
        以協助我們改善。
      </span>
    </Text>
  )

  return (
    <Box>
      <EmptyState
        releaseBranch={releaseBranch}
        title={'資料載入失敗'}
        showGuide={true}
        guide={guideJsx}
        showButton={false}
        style={EmptyState.Style.DEFAULT}
      />
    </Box>
  )
}

export default ErrorState
