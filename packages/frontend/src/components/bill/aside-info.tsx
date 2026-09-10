'use client'
import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
// components
import IssueTag from '@/components/button/issue-tag'
import {
  AsideInfoContainer,
  PersonAndAttendeeBlock,
  PersonBlock,
  PersonLabel,
  IssueTagsBlock,
  SlashIcon,
} from '@/components/general-article/aside-info'
// constants
import { InternalRoutes } from '@/constants/routes'
// styles
import {
  P1SupportiveHeavy,
  P2Gray600,
} from '@/components/general-article/styles'

const CouncilorBlock = styled(PersonBlock)`
  flex-wrap: wrap;
`

type AsideInfoProps = {
  councilors?: { name: string; slug: string; city: string }[]
  attendee?: string
  relatedTopics?: { title: string; slug: string; city: string }[]
}
const AsideInfo: React.FC<AsideInfoProps> = ({
  councilors = [],
  attendee,
  relatedTopics = [],
}) => {
  return (
    <AsideInfoContainer>
      <PersonAndAttendeeBlock>
        {councilors.length > 0 ? (
          <CouncilorBlock>
            <PersonLabel>
              <P2Gray600 text="提案人" />
              <SlashIcon />
            </PersonLabel>
            {councilors.map((councilor) => (
              <Link
                href={`${InternalRoutes.Councilor(councilor.city)}/${
                  councilor.slug
                }`}
                key={`councilor-${councilor.slug}`}
              >
                <P1SupportiveHeavy text={councilor.name} />
              </Link>
            ))}
          </CouncilorBlock>
        ) : null}
        {attendee ? <P2Gray600 text={`連署人／${attendee}`} /> : null}
      </PersonAndAttendeeBlock>
      {relatedTopics.length > 0 ? (
        <IssueTagsBlock>
          {relatedTopics.map((topic) => (
            <Link
              href={`${InternalRoutes.CouncilTopic(topic.city)}/${topic.slug}`}
              key={`council-topic-${topic.slug}`}
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
