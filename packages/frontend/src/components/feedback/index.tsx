'use client'

import React, { FC, useState } from 'react'
import styled, { css } from 'styled-components'
// context
import { FeedbackContext } from '@/components/feedback/context'
// type
import type {
  FeedbackValue,
  ContentDetail,
  ProductDetail,
} from '@/components/feedback/type'
// enum
import { FeedbackType } from '@/components/feedback/enum'
// constant
import { FEEDBACK_ID } from '@/constants'
// style
import { ZIndex } from '@/styles/z-index'
// component
import ChooseFeedbackType from '@/components/feedback/choose-feedback-type'
import ContentInfo from '@/components/feedback/content-info'
import ProductInfo from '@/components/feedback/product-info'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'

const maskCss = css`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Container = styled.div`
  ${maskCss}
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${ZIndex.Feedback};
  overflow: hidden;
  background-color: ${colorGrayscale.gray100};
`

const Mask = styled.div`
  ${maskCss}
  padding: 64px 0;
  background-color: ${colorOpacity['black_0.2']};
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
    problem: '',
  })

  const setTypeValue = (type: FeedbackType) => {
    setFeedbackValue((feedbackValue) => {
      feedbackValue.type = type
      return feedbackValue
    })
  }
  const setContentValue = (detail: ContentDetail) => {
    setFeedbackValue((feedbackValue) => {
      feedbackValue.email = detail.email
      feedbackValue.username = detail.username
      feedbackValue.problem = detail.problem
      return feedbackValue
    })
  }
  const setProductValue = (detail: ProductDetail) => {
    setFeedbackValue((feedbackValue) => {
      feedbackValue.deviceType = detail.deviceType
      feedbackValue.osType = detail.osType
      feedbackValue.browserType = detail.browserType
      feedbackValue.email = detail.email
      feedbackValue.problemType = detail.problemType
      feedbackValue.username = detail.username
      feedbackValue.problem = detail.problem

      return feedbackValue
    })
  }
  const contextJSX =
    step === 1 ? (
      <ChooseFeedbackType setFeedbackValue={setTypeValue} />
    ) : feedbackValue.type === FeedbackType.Content ? (
      <ContentInfo setFeedbackValue={setContentValue} />
    ) : (
      <ProductInfo setFeedbackValue={setProductValue} />
    )

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
        <Mask>
          <Dialog>{contextJSX}</Dialog>
        </Mask>
      </Container>
    </FeedbackContext.Provider>
  )
}

export default Feedback
