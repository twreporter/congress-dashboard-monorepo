import React, { memo, FC } from 'react'
// util
import { openFeedback } from '@/utils/feedback'
// style
import {
  ErrorMsgBox,
  ErrorMsg,
  SpanWithUnderline,
} from '@/components/selector/styles'

const ErrorState: FC = memo(() => (
  <ErrorMsgBox>
    <ErrorMsg>資料載入失敗，請嘗試重新整理頁面。若仍無法正常顯示，</ErrorMsg>
    <ErrorMsg>
      <span>歡迎點此</span>
      <SpanWithUnderline onClick={openFeedback}>回報問題</SpanWithUnderline>
      <span>以協助我們改善。</span>
    </ErrorMsg>
  </ErrorMsgBox>
))
ErrorState.displayName = 'selector-error-state'

export default ErrorState
