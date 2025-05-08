import React from 'react'
import styled from 'styled-components'
import type { Hit } from 'instantsearch.js'
import { Highlight, Snippet } from 'react-instantsearch'
import { Issue as IconIssue } from '@/components/search/icons'
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'

export type LegislatorRawHit = Hit<{
  objectID: string
  legislatorID: string
  name: string
  desc: string
  shortDesc: string
  imgSrc?: string
  term: number
  session: number
  latestSpeechAt?: string
  href: string
}>

export type SpeechRawHit = Hit<{
  objectID: string
  name: string
  legislatorNames: string[]
  legislatorIDs: string[]
  topic: string
  desc: string
  term: number
  session: number
  date: string
  href: string
}>

export type TopicRawHit = Hit<{
  objectID: string
  name: string
  desc: string
  shortDesc: string
  latestSpeechAt?: string
  href: string
  relatedMessageCount: number
}>

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid ${colorGrayscale.gray200};

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  & > img {
    object-fit: cover;
    width: 100%;
  }
`

const Text = styled.div`
  p {
    color: ${colorGrayscale.gray600};
    font-size: 14px;
    font-weight: 400;
    line-height: 150%;

    /* reset default margin */
    margin: 0;

    /* handle text overflow */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const InstantHitContainer = styled.div`
  width: 100%;
  margin: 4px 0;
  padding: 8px 16px;

  display: flex;
  gap: 12px;
  align-items: center;

  cursor: pointer;

  &:hover {
    background-color: ${colorGrayscale.gray100};
  }

  /* overwrite InstantSearch Highlight and Snippet styles */
  .ais-Highlight {
    font-size: 16px;
    font-weight: 700;
    line-height: 150%;
    color: ${colorGrayscale.gray800};
  }

  /* overwrite InstantSearch Highlight and Snippet styles */
  .ais-Highlight-highlighted,
  .ais-Snippet-highlighted {
    color: ${colorSupportive.heavy};
  }

  ${Avatar} {
    flex-shrink: 0;
  }

  ${Text} {
    overflow: hidden;
  }
`

export function InstantLegislatorHit({ hit }: { hit: LegislatorRawHit }) {
  return (
    <InstantHitContainer>
      <Avatar>
        {/* TODO: replace img by using `<Image />` from `next/image` */}
        <img src={hit.imgSrc} />
      </Avatar>
      <Text>
        <Highlight highlightedTagName="span" attribute="name" hit={hit} />
        <p>{hit.shortDesc}</p>
      </Text>
    </InstantHitContainer>
  )
}

export function InstantTopicHit({ hit }: { hit: TopicRawHit }) {
  return (
    <InstantHitContainer>
      <Avatar>
        <IconIssue />
      </Avatar>
      <Text>
        <Highlight highlightedTagName="span" attribute="name" hit={hit} />
        <p>
          <span>共{hit.relatedMessageCount}筆相關留言，</span>
          <Snippet highlightedTagName="span" attribute="desc" hit={hit} />
        </p>
      </Text>
    </InstantHitContainer>
  )
}
