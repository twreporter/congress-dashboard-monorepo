'use client'
import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
// @twreporter
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// styles
import { P1SupportiveHeavy, P2Gray600 } from '@/components/speech/styles'
// components
import IssueTag from '@/components/button/issue-tag'
// constants
import { InternalRoutes } from '@/constants/routes'

export const AsideInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  border-top: 1px solid ${colorGrayscale.gray300};
  border-bottom: 1px solid ${colorGrayscale.gray300};
  padding: 24px 0;
  position: relative;
  width: 100%;
  &::before {
    content: '';
    border-right: 0.5px solid ${colorGrayscale.gray300};
    width: 1px;
    height: 12px;
    top: 0;
    right: 0;
    position: absolute;
  }
  &::after {
    content: '';
    border-right: 0.5px solid ${colorGrayscale.gray300};
    width: 1px;
    height: 12px;
    bottom: 0;
    right: 0;
    position: absolute;
  }
`

export const LegislatorAndAttendeeBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const LegislatorBlock = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      text-decoration-color: ${colorSupportive.heavy};
    }
  }
`

export const Questioning = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
`

export const IssueTagsBlock = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  a {
    text-decoration: none;
  }
  ${mq.desktopOnly`
    flex-direction: column;
  `}
`

export const SlashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
  >
    <path d="M1.28 12.5L14.72 1.5" stroke="#C09662" strokeLinecap="square" />
  </svg>
)

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
      <LegislatorAndAttendeeBlock>
        <LegislatorBlock>
          <Questioning>
            <P2Gray600 text="質詢立委" />
            <SlashIcon />
          </Questioning>
          <Link href={`${InternalRoutes.Legislator}/${legislator.slug}`}>
            <P1SupportiveHeavy text={legislator.name} />
          </Link>
        </LegislatorBlock>
        {attendee ? <P2Gray600 text={`列席質詢對象／${attendee}`} /> : null}
      </LegislatorAndAttendeeBlock>
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
