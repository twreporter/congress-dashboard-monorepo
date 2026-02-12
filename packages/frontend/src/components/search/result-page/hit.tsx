'use client'

import Link from 'next/link'
import React from 'react'
import mq from '@twreporter/core/lib/utils/media-query'
import styled from 'styled-components'
import type { Hit } from 'instantsearch.js'
import { InternalRoutes } from '@/constants/routes'
import { Highlight, Snippet } from 'react-instantsearch'
import {
  colorOpacity,
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
import { buildMeetingTermParam } from '@/components/search/result-page/utils'
import { useCustomSnippet } from '@/components/search/result-page/hooks'
import type {
  LegislatorRawHit,
  TopicRawHit,
  CouncilorRawHit,
  CouncilTopicRawHit,
} from '@/components/search/instant-hit'

export type SpeechRawHit = Hit<{
  objectID: string
  slug: string
  title: string
  summary: string
  meetingTerm: number
  sessionTerm: number
  date: string
  legislatorName: string
}>

export type CouncilBillRawHit = Hit<{
  objectID: string
  slug: string
  title: string
  summary?: string
  date: string
  districtSlug: string
  council: string
  councilor: string
  councilorCount: number
}>

/**
 * `AvatarBorder` is a workaround to address rendering issues when applying a semi-transparent border directly on `Avatar`.
 *
 * While it's possible to use `border-radius` and `border` on `Avatar` itself,
 * the semi-transparent border color overlays the background image,
 * making the border appear not cleanly rounded.
 *
 * To solve this, we wrap the `Avatar` with an outer container `AvatarBorder`,
 * which simulates the border using padding and a background color.
 */
const AvatarBorder = styled.div`
  width: fit-content;
  height: fit-content;

  background-color: ${colorOpacity['black_0.05']};
  border-radius: 4px;
  padding: 1px;
`

const Avatar = styled.div<{ $imgSrc: string }>`
  ${({ $imgSrc }) => {
    return `background-image: url(${$imgSrc});`
  }}
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  border-radius: 4px;

  position: relative;

  ${mq.desktopAndAbove`
    width: 114px;
    height: 147px;
  `}

  ${mq.tabletAndBelow`
    width: 109px;
    height: 141px;
  `}
`

const Party = styled.div<{ $imgSrc: string }>`
  ${({ $imgSrc }) => {
    return `background-image: url(${$imgSrc});`
  }}
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${colorGrayscale.gray200};
  background-color: ${colorGrayscale.white};
  box-shadow: 0px 0px 4px 0px ${colorOpacity['black_0.2']};

  position: absolute;
  left: 8px;
  bottom: 8px;
`

const LegislatorDesc = styled.p`
  /* truncate text to two lines and show ellipsis (…) when text is truncated */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  height: 48px;
`
const Text = styled.div`
  p {
    color: ${colorGrayscale.gray800};
    font-size: 16px;
    font-weight: 400;
    line-height: 150%;

    /* reset default margin */
    margin: 0 0 8px 0;
  }

  p:first-child {
    font-size: 14px;
    font-weight: 700;
    color: ${colorGrayscale.gray900};
  }

  p:last-child {
    font-size: 14px;
    margin: 0;
  }

  /* overwrite InstantSearch Highlight and Snippet styles */
  .ais-Highlight.title {
    font-size: 22px;
    font-weight: 700;
    line-height: 150%;
    color: ${colorGrayscale.gray900};
  }

  ${mq.tabletAndBelow`
    /* overwrite InstantSearch Highlight and Snippet styles */
    .ais-Highlight.title {
      font-size: 18px;
    }
  `}

  /* overwrite InstantSearch Highlight and Snippet styles */
  .ais-Highlight-highlighted,
  .ais-Snippet-highlighted {
    color: ${colorSupportive.heavy};
  }
`

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;

  border-bottom: 1px solid ${colorGrayscale.gray300};

  ${Avatar} {
    flex-shrink: 0;
  }

  ${mq.desktopAndAbove`
    padding-top: 32px;
    padding-bottom: 32px;
  `}

  ${mq.tabletAndBelow`
    padding-top: 24px;
    padding-bottom: 24px;
  `}
`

/**
 * Renders a search result hit for a legislator (立委)
 *
 * Displays:
 * - Legislator name with highlighting
 * - Description
 * - Latest speech date (if available)
 * - Avatar with party logo
 *
 * Links to legislator detail page with meeting term filter
 */
export function LegislatorHit({ hit }: { hit: LegislatorRawHit }) {
  const meetingTermParam = buildMeetingTermParam(hit.meetingTerm)
  return (
    <Link href={`${InternalRoutes.Legislator}/${hit.slug}${meetingTermParam}`}>
      <Container>
        <Text>
          <p>立委</p>
          <p>
            <Highlight
              classNames={{
                root: 'title',
              }}
              highlightedTagName="span"
              attribute="name"
              hit={hit}
            />
          </p>
          <LegislatorDesc>{hit.desc}</LegislatorDesc>
          {hit.lastSpeechAt && <p>最新一筆發言於{hit.lastSpeechAt}</p>}
        </Text>
        <AvatarBorder>
          <Avatar $imgSrc={hit.imgSrc}>
            <Party $imgSrc={hit.partyImgSrc} />
          </Avatar>
        </AvatarBorder>
      </Container>
    </Link>
  )
}

/**
 * Renders a search result hit for a councilor (議員)
 *
 * Displays:
 * - Councilor name with highlighting
 * - Council affiliation
 * - Description
 * - Latest speech date (if available)
 * - Avatar with party logo
 *
 * Links to councilor detail page with optional meeting term filter
 */
export function CouncilorHit({ hit }: { hit: CouncilorRawHit }) {
  const meetingTermParam = buildMeetingTermParam(hit.meetingTerm)
  return (
    <Link
      href={`${InternalRoutes.Councilor(hit.councilSlug)}/${
        hit.slug
      }${meetingTermParam}`}
    >
      <Container>
        <Text>
          <p>議員｜{hit.council}</p>
          <p>
            <Highlight
              classNames={{
                root: 'title',
              }}
              highlightedTagName="span"
              attribute="name"
              hit={hit}
            />
          </p>
          <LegislatorDesc>{hit.desc}</LegislatorDesc>
          {hit.lastSpeechAt && <p>最新一筆發言於{hit.lastSpeechAt}</p>}
        </Text>
        <AvatarBorder>
          <Avatar $imgSrc={hit.imgSrc}>
            <Party $imgSrc={hit.partyImgSrc} />
          </Avatar>
        </AvatarBorder>
      </Container>
    </Link>
  )
}

/**
 * Renders a search result hit for a topic (議題)
 *
 * Displays:
 * - Topic name with highlighting
 * - Related message count and description snippet
 * - Latest speech date (if available)
 *
 * Links to topic detail page with meeting term filter
 */
export function TopicHit({ hit }: { hit: TopicRawHit }) {
  const customizedHit = useCustomSnippet(hit)
  const meetingTermParam = buildMeetingTermParam(hit.meetingTerm)

  return (
    <Link href={`${InternalRoutes.Topic}/${hit.slug}${meetingTermParam}`}>
      <Container>
        <Text>
          <p>議題｜立法院</p>
          <p>
            <Highlight
              classNames={{
                root: 'title',
              }}
              highlightedTagName="span"
              attribute="name"
              hit={hit}
            />
          </p>
          <p>
            <span>共{hit.relatedMessageCount}筆發言：</span>
            <Snippet
              highlightedTagName="span"
              attribute="desc"
              hit={customizedHit}
            />
          </p>
          {hit.lastSpeechAt && <p>最新一筆發言於{hit.lastSpeechAt}</p>}
        </Text>
      </Container>
    </Link>
  )
}

/**
 * Renders a search result hit for a council topic (議題)
 *
 * Displays:
 * - Topic name with highlighting
 * - Council affiliation
 * - Bill count and description snippet
 * - Latest speech date (if available)
 *
 * Links to council topic page with optional meeting term filter
 */
export function CouncilTopicHit({ hit }: { hit: CouncilTopicRawHit }) {
  const customizedHit = useCustomSnippet(hit)
  const meetingTermParam = buildMeetingTermParam(hit.meetingTerm)

  return (
    <Link
      href={`${InternalRoutes.CouncilTopic(hit.councilSlug)}/${
        hit.slug
      }${meetingTermParam}`}
    >
      <Container>
        <Text>
          <p>議題｜{hit.council}</p>
          <p>
            <Highlight
              classNames={{
                root: 'title',
              }}
              highlightedTagName="span"
              attribute="name"
              hit={hit}
            />
          </p>
          <p>
            <span>共{hit.billCount}筆相關議案：</span>
            <Snippet
              highlightedTagName="span"
              attribute="desc"
              hit={customizedHit}
            />
          </p>
          {hit.lastSpeechAt && <p>最新一筆發言於{hit.lastSpeechAt}</p>}
        </Text>
      </Container>
    </Link>
  )
}

/**
 * Renders a search result hit for a speech (發言全文)
 *
 * Displays:
 * - Speech title with highlighting
 * - Summary snippet
 * - Legislator name
 * - Meeting date
 *
 * Links to speech detail page with meeting term and session term filters
 */
export function SpeechHit({ hit }: { hit: SpeechRawHit }) {
  const customizedHit = useCustomSnippet(hit, 'summary')

  return (
    <Link
      href={`${InternalRoutes.Speech}/${hit.slug}?meetingTerm=${hit.meetingTerm}&sessionTerm=[${hit.sessionTerm}]`}
    >
      <Container>
        <Text>
          <p>發言全文</p>
          <p>
            <Highlight
              classNames={{
                root: 'title',
              }}
              highlightedTagName="span"
              attribute="title"
              hit={hit}
            />
          </p>
          <p>
            <Snippet
              highlightedTagName="span"
              attribute="summary"
              hit={customizedHit}
            />
          </p>
          <p>
            質詢立委／
            <Highlight
              highlightedTagName="span"
              attribute="legislatorName"
              hit={hit}
            />
            ．發言於 {hit.date}
          </p>
        </Text>
      </Container>
    </Link>
  )
}

/**
 * Renders a search result hit for a council bill (議案)
 *
 * Displays:
 * - Bill title with highlighting
 * - Council affiliation
 * - Summary snippet (if available)
 * - Councilor proposer and co-proposer count
 * - Decision date
 *
 * Links to council bill detail page
 */
export function CouncilBillHit({ hit }: { hit: CouncilBillRawHit }) {
  const customizedHit = useCustomSnippet(hit, 'summary')

  return (
    <Link href={`${InternalRoutes.Bill}/${hit.slug}`}>
      <Container>
        <Text>
          <p>議案｜{hit.council}</p>
          <p>
            <Highlight
              classNames={{
                root: 'title',
              }}
              highlightedTagName="span"
              attribute="title"
              hit={hit}
            />
          </p>
          {hit.summary && (
            <p>
              <Snippet
                highlightedTagName="span"
                attribute="summary"
                hit={customizedHit}
              />
            </p>
          )}
          <p>
            提案人／
            <Highlight
              highlightedTagName="span"
              attribute="councilor"
              hit={hit}
            />
            等{hit.councilorCount}人．議決日期於{hit.date}
          </p>
        </Text>
      </Container>
    </Link>
  )
}
