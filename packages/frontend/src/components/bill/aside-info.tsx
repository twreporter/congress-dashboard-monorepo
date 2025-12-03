'use client'
import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
// components
import IssueTag from '@/components/button/issue-tag'
import { SlashIcon } from '@/components/speech/speech-aside-info'
// constants
import { InternalRoutes } from '@/constants/routes'
// styles
import { P1SupportiveHeavy, P2Gray600 } from '@/components/speech/styles'
import {
  AsideInfoContainer,
  LegislatorAndAttendeeBlock,
  LegislatorBlock,
  Questioning,
  IssueTagsBlock,
} from '@/components/speech/speech-aside-info'

const CouncilorBlock = styled(LegislatorBlock)`
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
      <LegislatorAndAttendeeBlock>
        {councilors.length > 0 ? (
          <CouncilorBlock>
            <Questioning>
              <P2Gray600 text="提案人" />
              <SlashIcon />
            </Questioning>
            {councilors.map((councilor) => (
              <Link
                href={`${InternalRoutes.Council}/${councilor.city}${InternalRoutes.Councilor}/${councilor.slug}`}
                key={`councilor-${councilor.slug}`}
              >
                <P1SupportiveHeavy text={councilor.name} />
              </Link>
            ))}
          </CouncilorBlock>
        ) : null}
        {attendee ? <P2Gray600 text={`列席人員／${attendee}`} /> : null}
      </LegislatorAndAttendeeBlock>
      {relatedTopics.length > 0 ? (
        <IssueTagsBlock>
          {relatedTopics.map((topic) => (
            <Link
              href={`${InternalRoutes.Council}/${topic.city}${InternalRoutes.CouncilTopic}/${topic.slug}`}
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
