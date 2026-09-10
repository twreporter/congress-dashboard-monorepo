'use client'
import React from 'react'
import Link from 'next/link'
// styles
import {
  P1SupportiveHeavy,
  P2Gray600,
} from '@/components/general-article/styles'
import {
  AsideInfoContainer,
  PersonAndAttendeeBlock,
  PersonBlock,
  PersonLabel,
  IssueTagsBlock,
  SlashIcon,
} from '@/components/general-article/aside-info'
// components
import IssueTag from '@/components/button/issue-tag'
// constants
import { InternalRoutes } from '@/constants/routes'

type AsideInfoProps = {
  legislator: { name: string; slug: string }
  attendee?: string
  relatedTopics?: { title: string; slug: string }[]
}
const AsideInfo: React.FC<AsideInfoProps> = ({
  legislator,
  attendee,
  relatedTopics = [],
}) => {
  return (
    <AsideInfoContainer>
      <PersonAndAttendeeBlock>
        <PersonBlock>
          <PersonLabel>
            <P2Gray600 text="質詢立委" />
            <SlashIcon />
          </PersonLabel>
          <Link href={`${InternalRoutes.Legislator}/${legislator.slug}`}>
            <P1SupportiveHeavy text={legislator.name} />
          </Link>
        </PersonBlock>
        {attendee ? <P2Gray600 text={`列席質詢對象／${attendee}`} /> : null}
      </PersonAndAttendeeBlock>
      {relatedTopics.length > 0 ? (
        <IssueTagsBlock>
          {relatedTopics.map((topic) => (
            <Link
              href={`${InternalRoutes.Topic}/${topic.slug}`}
              key={topic.slug}
            >
              <IssueTag text={topic.title} />
            </Link>
          ))}
        </IssueTagsBlock>
      ) : null}
    </AsideInfoContainer>
  )
}

export default React.memo(AsideInfo)
