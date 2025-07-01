import React, { memo, FC } from 'react'
import styled from 'styled-components'
// util
import { openFeedback } from '@/utils/feedback'
// style
import {
  P1Gray800Bold,
  P1Gray700,
  SpanWithUnderline,
  H5Gray800,
} from '@/components/sidebar/style'

// body error component
const BodyErrorBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-contents: center;
  aliign-items: center;
  gap: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
const BodyErrorTitle = styled(H5Gray800)`
  display: flex;
  justify-content: center;
`
const BodyErrorTextBox = styled.div`
  text-align: center;
`
const BodyErrorText = styled(P1Gray700)`
  justify-content: center;
`
export const BodyErrorState: FC = memo(() => (
  <BodyErrorBox>
    <BodyErrorTitle text={'資料載入失敗'} />
    <BodyErrorTextBox>
      <BodyErrorText>請嘗試重新整理頁面。若仍無法正常顯示，</BodyErrorText>
      <BodyErrorText>
        <span>歡迎點此</span>
        <SpanWithUnderline onClick={openFeedback}>回報問題</SpanWithUnderline>
        <span>以協助我們改善。</span>
      </BodyErrorText>
    </BodyErrorTextBox>
  </BodyErrorBox>
))
BodyErrorState.displayName = 'sidebar-body-error-state'

// follow more error component
const FollowMoreErrorBox = styled.div`
  padding: 16px;
  background-color: rgba(241, 241, 241, 0.5);
`
const FollowMoreErrorText = styled(P1Gray700)`
  display: contents;
  margin-top: 4px;
`

export const FollowMoreErrorState: FC = memo(() => (
  <FollowMoreErrorBox>
    <P1Gray800Bold text={'資料載入失敗'} />
    <FollowMoreErrorText>
      <span>請嘗試重新整理頁面。若仍無法正常顯示，歡迎點此</span>
      <SpanWithUnderline onClick={openFeedback}>回報問題</SpanWithUnderline>
      <span>以協助我們改善。</span>
    </FollowMoreErrorText>
  </FollowMoreErrorBox>
))
FollowMoreErrorState.displayName = 'follow-more-error-state'
