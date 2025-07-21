import React, { FC, useContext, useState } from 'react'
// context
import { FeedbackContext } from '@/components/feedback/context'
// enum
import { FeedbackType } from '@/components/feedback/enum'
// component
import SelectCard from '@/components/feedback/select-card'
// style
import {
  Box,
  TitleBlock,
  OptionBlock,
  ActionBlock,
  Title,
  CloseButton,
  ActionButton,
} from '@/components/feedback/style'
// @twreporter
import { PillButton } from '@twreporter/react-components/lib/button'
import { Cross } from '@twreporter/react-components/lib/icon'

// global var
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

type ChooseFeedbackTypeProps = {
  setFeedbackValue?: (type: FeedbackType) => void
}

const ChooseFeedbackType: FC<ChooseFeedbackTypeProps> = ({
  setFeedbackValue,
}) => {
  const { nextStep, closeFeedback } = useContext(FeedbackContext)
  const [selectedType, setSelectedType] = useState<FeedbackType>()
  const next = () => {
    if (!selectedType) {
      return
    }
    if (typeof setFeedbackValue === 'function') {
      setFeedbackValue(selectedType)
    }
    nextStep()
  }

  return (
    <Box>
      <TitleBlock>
        <Title text={'選擇回報類型'} />
        <CloseButton
          iconComponent={<Cross releaseBranch={releaseBranch} />}
          onClick={closeFeedback}
        />
      </TitleBlock>
      <OptionBlock>
        <SelectCard
          value={FeedbackType.Content}
          checked={selectedType === FeedbackType.Content}
          onChange={() => setSelectedType(FeedbackType.Content)}
          title={'內容問題'}
          description={'發現錯字、資訊錯誤或內容異常？請回報給我們！'}
        />
        <SelectCard
          value={FeedbackType.Product}
          checked={selectedType === FeedbackType.Product}
          onChange={() => setSelectedType(FeedbackType.Product)}
          title={'產品問題'}
          description={'遇到功能異常或有改進建議？歡迎提供您的回饋！'}
        />
      </OptionBlock>
      <ActionBlock>
        <ActionButton
          theme={PillButton.THEME.normal}
          type={PillButton.Type.SECONDARY}
          size={PillButton.Size.L}
          text={'取消'}
          onClick={closeFeedback}
        />
        <ActionButton
          theme={PillButton.THEME.normal}
          type={PillButton.Type.PRIMARY}
          size={PillButton.Size.L}
          text={'下一步'}
          disabled={!selectedType}
          onClick={next}
        />
      </ActionBlock>
    </Box>
  )
}

export default ChooseFeedbackType
