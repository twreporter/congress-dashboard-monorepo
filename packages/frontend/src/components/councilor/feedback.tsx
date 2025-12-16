'use client'
import React from 'react'
// util
import { openFeedback } from '@/utils/feedback'
// style
import { Container, Feedback } from '@/components/topic/topic-feedback'

const CouncilorFeedback: React.FC = () => {
  return (
    <Container>
      <span>
        發現什麼問題嗎？透過
        <Feedback onClick={() => openFeedback('councilor')}>問題回報</Feedback>
        告訴我們，一起打造更完善的國會觀測站！
      </span>
    </Container>
  )
}

export default CouncilorFeedback
