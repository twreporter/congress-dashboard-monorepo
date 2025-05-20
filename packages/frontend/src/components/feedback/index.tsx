'use client'

import React, { FC, useState } from 'react'
import styled, { css } from 'styled-components'
// api
import feedback from '@/fetchers/feedback'
// context
import { FeedbackContext } from '@/components/feedback/context'
// type
import type { ContentDetail, ProductDetail } from '@/components/feedback/type'
// enum
import { FeedbackType } from '@/components/feedback/enum'
// constant
import { FEEDBACK_ID } from '@/constants'
// util
import { closeFeedback } from '@/utils/feedback'
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
import mq from '@twreporter/core/lib/utils/media-query'

const maskCss = css`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Container = styled.div`
  ${maskCss}
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${ZIndex.Feedback};
  overflow: hidden;
  display: none;

  ${mq.mobileOnly`
    background-color: ${colorGrayscale.white}  
  `}
`

const Mask = styled.div`
  ${maskCss}

  ${mq.tabletAndAbove`  
    padding: 64px 0;
    background-color: ${colorOpacity['black_0.2']};
  `}
`

const Dialog = styled.div`
  width: 480px;
  max-height: 100%;
  overflow-y: scroll;
  background-color: ${colorGrayscale.white};
  border-radius: 8px;
  box-shadow: 0px 0px 24px 0px ${colorOpacity['black_0.1']};

  ${mq.mobileOnly`
    width: 100%;
    height: 100%;
  `}
`

const Feedback: FC = () => {
  const [step, setStep] = useState(1)
  const [type, setType] = useState<FeedbackType>()

  const nextStep = () => {
    setStep((step) => step + 1)
  }

  const prevStep = () => {
    setStep((step) => step - 1)
  }

  const submit = async (data: ContentDetail | ProductDetail) => {
    const userAgent = window.navigator.userAgent
    const url = window.location.href
    await feedback({ userAgent, fromUrl: url, ...data })
    setStep(1)
    closeFeedback()
  }

  const contextJSX =
    step === 1 ? (
      <ChooseFeedbackType setFeedbackValue={setType} />
    ) : type === FeedbackType.Content ? (
      <ContentInfo submit={submit} />
    ) : (
      <ProductInfo submit={submit} />
    )

  const contextValue = {
    closeFeedback,
    nextStep,
    prevStep,
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
