'use client'

import React, { FC, useState } from 'react'
import styled from 'styled-components'
// context
import { FeedbackContext } from '@/components/feedback/context'
// type
import type { FeedbackValue } from '@/components/feedback/type'
// enum
import { FeedbackType } from '@/components/feedback/enum'
// constant
import { FEEDBACK_ID } from '@/constants'
// component
import ChooseFeedbackType from '@/components/feedback/choose-feedback-type'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'

const Container = styled.div`
  background-color: ${colorOpacity['black_0.2']};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  padding: 64px 0;
`

const Dialog = styled.div`
  width: 480px;
  max-height: 100%;
  overflow-y: scroll;
  background-color: ${colorGrayscale.white};
  border-radius: 8px;
  box-shadow: 0px 0px 24px 0px ${colorOpacity['black_0.1']};
`

const Feedback: FC = () => {
  const [step, setStep] = useState(1)
  const [feedbackValue, setFeedbackValue] = useState<FeedbackValue>({
    fromUrl: '',
  })

  const setTypeValue = (type: FeedbackType) => {
    setFeedbackValue((feedbackValue) => {
      feedbackValue.type = type
      return feedbackValue
    })
  }
  const contextJSX =
    step === 1 ? <ChooseFeedbackType setFeedbackValue={setTypeValue} /> : null

  const closeFeedback = () => {
    console.log('close feedback')
  }
  const nextStep = () => {
    setStep((step) => step + 1)
  }
  const prevStep = () => {
    setStep((step) => step - 1)
  }

  const contextValue = {
    closeFeedback,
    nextStep,
    prevStep,
    feedbackValue,
  }

  return (
    <FeedbackContext.Provider value={contextValue}>
      <Container id={FEEDBACK_ID}>
        <Dialog>{contextJSX}</Dialog>
      </Container>
    </FeedbackContext.Provider>
  )
}

export default Feedback
