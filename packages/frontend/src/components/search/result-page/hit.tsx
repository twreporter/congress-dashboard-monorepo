'use client'

import Link from 'next/link'
import React from 'react'
import mq from '@twreporter/core/lib/utils/media-query'
import styled from 'styled-components'
import type { Hit } from 'instantsearch.js'
import type { HitAttributeSnippetResult } from 'instantsearch.js'
import useWindowWidth from '@/hooks/use-window-width'
import { InternalRoutes } from '@/constants/routes'
import { Highlight, Snippet, useSearchBox } from 'react-instantsearch'
import {
  colorOpacity,
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
import { generateSnippetForDevices } from '@/components/search/result-page/utils'
import type {
  LegislatorRawHit,
  TopicRawHit,
} from '@/components/search/instant-hit'

export type SpeechRawHit = Hit<{
  objectID: string
  slug: string
  title: string
  summary: string
  term: number
  session: number
  date: string
  legislatorName: string
}>

const Avatar = styled.div<{ $imgSrc: string }>`
  ${({ $imgSrc }) => {
    return `background-image: url(${$imgSrc});`
  }}
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  border: 1px solid ${colorOpacity['black_0.05']};
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

export function LegislatorHit({ hit }: { hit: LegislatorRawHit }) {
  return (
    <Link
      href={`${InternalRoutes.Legislator}/${hit.slug}?meetingTerm=${hit.term}`}
    >
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
          <p>最新一筆發言於{hit.lastSpeechAt}</p>
        </Text>
        <Avatar $imgSrc={hit.imgSrc}>
          <Party $imgSrc={hit.partyImgSrc} />
        </Avatar>
      </Container>
    </Link>
  )
}

export function TopicHit({ hit }: { hit: TopicRawHit }) {
  const { query } = useSearchBox()
  const windowWidth = useWindowWidth()
  const matchedTextArr = query.split(' ')
  const snippet = generateSnippetForDevices(
    hit.desc,
    matchedTextArr,
    windowWidth
  )

  const customizedHit = {
    ...hit,
    // Algolia allows only one global snippet length setting via attributesToSnippet.
    // However, our UI requires different truncation lengths for different viewports.
    // Therefore, we manually override _snippetResult.desc.value to use a custom snippet.
    _snippetResult: {
      ...(hit._snippetResult ?? {}),
      desc: {
        value: snippet,
        matchLevel: (hit._snippetResult?.summary as HitAttributeSnippetResult)
          ?.matchLevel,
      } as HitAttributeSnippetResult,
    },
  }
  return (
    <Link
      href={`${InternalRoutes.Topic}/${hit.slug}?meetingTerm=${hit.term}&sessionTerm=[${hit.session}]`}
    >
      <Container>
        <Text>
          <p>議題</p>
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
          <p>最新一筆發言於{hit.lastSpeechAt}</p>
        </Text>
      </Container>
    </Link>
  )
}

export function SpeechHit({ hit }: { hit: SpeechRawHit }) {
  const { query } = useSearchBox()
  const windowWidth = useWindowWidth()
  const matchedTextArr = query.split(' ')
  const snippet = generateSnippetForDevices(
    hit.summary,
    matchedTextArr,
    windowWidth
  )

  const customizedHit = {
    ...hit,
    // Algolia allows only one global snippet length setting via attributesToSnippet.
    // However, our UI requires different truncation lengths for different viewports.
    // Therefore, we manually override _snippetResult.summary.value to use a custom snippet.
    _snippetResult: {
      ...(hit._snippetResult ?? {}),
      summary: {
        value: snippet,
        matchLevel: (hit._snippetResult?.summary as HitAttributeSnippetResult)
          ?.matchLevel,
      } as HitAttributeSnippetResult,
    },
  }

  return (
    <Link
      href={`${InternalRoutes.Speech}/${hit.slug}?meetingTerm=${hit.term}&sessionTerm=[${hit.session}]`}
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
