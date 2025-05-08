import React, { FC, useContext, useState } from 'react'
import styled from 'styled-components'
// context
import { FeedbackContext } from '@/components/feedback/context'
// enum
import { FeedbackType } from '@/components/feedback/enum'
// component
import SelectCard from '@/components/feedback/select-card'
// @twreporter
import { IconButton, PillButton } from '@twreporter/react-components/lib/button'
import { Cross } from '@twreporter/react-components/lib/icon'
import { H5 } from '@twreporter/react-components/lib/text/headline'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

// global var
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

const Box = styled.div`
  width: 100%;
`
const TitleBlock = styled.div`
  display: flex;
  padding: 16px;
  align-items: center;
  justify-content: center;
`
const OptionBlock = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`
const ActionBlock = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px 24px;
`
const Title = styled(H5)`
  color: ${colorGrayscale.gray800};
`
const ActionButton = styled(PillButton)`
  display: flex;
  width: 144px;
  align-items: center;
  justify-content: center;
`

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
      // todo: alert not select
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
        <IconButton
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
          title={'內容問題'}
          description={'發現錯字、資訊錯誤或內容異常？請回報給我們！'}
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
          onClick={next}
        />
      </ActionBlock>
    </Box>
  )
}

export default ChooseFeedbackType
