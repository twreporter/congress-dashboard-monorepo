import React from 'react'
import Link from 'next/link'
import { Issue } from '@/components/sidebar/followMore'
import {
  OthersWatchingBlock,
  OthersWatchingTags,
  H4Title,
} from '@/components/topic/styles'
import { othersWatchingTags } from '@/components/topic/mockData'

type TopicOthersWatchingProps = {
  currentMeetingTerm: number
  currentMeetingSession: number[]
}

const TopicOthersWatching: React.FC<TopicOthersWatchingProps> = ({
  currentMeetingTerm,
  currentMeetingSession,
}) => {
  return (
    <OthersWatchingBlock>
      <H4Title text="其他人也在看" />
      <OthersWatchingTags>
        {othersWatchingTags.map((topic, idx) => (
          <Link
            href={`/topics/${
              topic.slug
            }?meetingTerm=${currentMeetingTerm}&sessionTerm=${JSON.stringify(
              currentMeetingSession
            )}`}
            key={`issue-tag-${idx}-${topic.slug}`}
          >
            <Issue name={topic.title} />
          </Link>
        ))}
      </OthersWatchingTags>
    </OthersWatchingBlock>
  )
}

export default TopicOthersWatching
