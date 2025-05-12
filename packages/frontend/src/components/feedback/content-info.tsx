'use client'

import React, { FC, useContext, useState } from 'react'
// context
import { FeedbackContext } from '@/components/feedback/context'
// type
import type { ContentDetail } from '@/components/feedback/type'
// component
import { TextOption, TextareaOption } from '@/components/feedback/option-group'

// style
import {
  Box,
  TitleBlock,
  OptionBlock,
  ActionBlock,
  Title,
  ActionButton,
} from '@/components/feedback/style'
// @twreporter
import { IconButton, PillButton } from '@twreporter/react-components/lib/button'
import { Cross } from '@twreporter/react-components/lib/icon'

// global var
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

type ContentInfoProps = {
  setFeedbackValue?: (contentDetail: ContentDetail) => void
}

const ContentInfo: FC<ContentInfoProps> = ({ setFeedbackValue }) => {
  const { prevStep, closeFeedback } = useContext(FeedbackContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [problem, setProblem] = useState('')

  const submit = () => {
    // todo: add validation

    if (typeof setFeedbackValue === 'function') {
      setFeedbackValue({ username, email, problem })
    }
  }

  return (
    <Box>
      <TitleBlock>
        <Title text={'選擇回報類型'} />
        <IconButton
          iconComponent={<Cross releaseBranch={releaseBranch} />}
          onClick={closeFeedback}
        />
      </TitleBlock>
      <OptionBlock>
        <TextOption
          label={'希望報導者如何稱呼您'}
          placeholder={'王小明'}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextOption
          label={'Email（若需要處理進度回報，可留下您的聯繫方式）'}
          placeholder={'twreporter@gmail.com'}
          value={email}
          type={'email'}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextareaOption
          label={'問題描述'}
          placeholder={'請描述您發現的異常內容'}
          value={problem}
          maxLength={250}
          onChange={(e) => setProblem(e.target.value)}
        />
      </OptionBlock>
      <ActionBlock>
        <ActionButton
          theme={PillButton.THEME.normal}
          type={PillButton.Type.SECONDARY}
          size={PillButton.Size.L}
          text={'上一步'}
          onClick={prevStep}
        />
        <ActionButton
          theme={PillButton.THEME.normal}
          type={PillButton.Type.PRIMARY}
          size={PillButton.Size.L}
          text={'完成送出'}
          onClick={submit}
        />
      </ActionBlock>
    </Box>
  )
}

export default ContentInfo
