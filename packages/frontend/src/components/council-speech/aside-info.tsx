import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
// types
import type { CouncilSpeechData } from '@/types/council-speech'
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

const CouncilorLinkBlock = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
`

type AsideInfoProps = {
  councilors?: CouncilSpeechData['councilors']
  attendee?: CouncilSpeechData['attendee']
  relatedTopics?: CouncilSpeechData['relatedTopics']
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
              <P2Gray600 text="諮詢議員" />
              <SlashIcon />
            </PersonLabel>
            <CouncilorLinkBlock>
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
            </CouncilorLinkBlock>
          </CouncilorBlock>
        ) : null}
        {attendee ? <P2Gray600 text={`列席質詢對象／${attendee}`} /> : null}
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
