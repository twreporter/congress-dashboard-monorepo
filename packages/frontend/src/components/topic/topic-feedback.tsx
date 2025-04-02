import React from 'react'
import Link from 'next/link'
import { Feedback } from '@/components/topic/styles'

const TopicFeedback: React.FC = () => {
  return (
    <Feedback>
      <span>
        發現什麼問題嗎？透過
        <Link href={'/feedback'} target="_blank">
          問題回報
        </Link>
        告訴我們，一起讓這裡變得更好！
      </span>
    </Feedback>
  )
}

export default TopicFeedback
