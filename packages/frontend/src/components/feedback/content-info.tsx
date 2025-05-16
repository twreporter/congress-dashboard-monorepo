'use client'

import React, { FC, useContext, useState, useMemo } from 'react'
// context
import { FeedbackContext } from '@/components/feedback/context'
// util
import { emailValidator } from '@/utils/validate-email'
// enum
import { FeedbackType } from '@/components/feedback/enum'
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
  submit?: (contentDetail: ContentDetail) => void
}

const ContentInfo: FC<ContentInfoProps> = ({ submit }) => {
  const { prevStep, closeFeedback } = useContext(FeedbackContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [problem, setProblem] = useState('')

  const emailError = useMemo(
    () => (!isEmailValid && email ? '電子信箱格式錯誤，請重新輸入' : ''),
    [email, isEmailValid]
  )

  const validateEmail = () => {
    setIsEmailValid(emailValidator(email))
  }

  const handleSubmit = () => {
    if (!isEmailValid) {
      return
    }
    if (typeof submit === 'function') {
      submit({ type: FeedbackType.Content, username, email, problem })
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
          error={emailError}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
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
          onClick={handleSubmit}
          disabled={!isEmailValid}
        />
      </ActionBlock>
    </Box>
  )
}

export default ContentInfo
