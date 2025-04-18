import React from 'react'
import styled from 'styled-components'
import type { Hit } from 'instantsearch.js'
import { Highlight } from 'react-instantsearch'
import { Issue as IconIssue } from './icons'

enum HitTypes {
  Legislator = 'legislator',
  Speech = 'speech',
  Topic = 'topic',
}

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
  type: HitTypes.Legislator
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
}>

const InstantHitContainer = styled.div`
  width: 100%;
  margin: 4px 0;
  padding: 8px 16px;

  display: flex;
  gap: 12px;
  align-items: center;

  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }

  > h3 {
    font-size: 16px;
    font-weight: 700;
    line-height: 150%;

    /* reset default margin */
    margin: 0 0 2px 0;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 150%;

    color: #808080;

    /* reset default margin */
    margin: 0;

    /* handle text overflow */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* overwrite InstantSearch Highlight styles */
  .ais-Highlight {
    font-size: 16px;
    font-weight: 700;
    line-height: 150%;
    color: #262626;
  }

  /* overwrite InstantSearch Highlight styles */
  .ais-Highlight-highlighted {
    color: #9f7544;
  }
`

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #e2e2e2;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  & > img {
    object-fit: cover;
    width: 100%;
  }
`

export function InstantLegislatorHit({ hit }: { hit: LegislatorRawHit }) {
  return (
    <InstantHitContainer>
      <Avatar>
        {/* TODO: replace img by using `<Image />` from `next/image` */}
        <img src={hit.imgSrc} />
      </Avatar>
      <div>
        <Highlight highlightedTagName="span" attribute="name" hit={hit} />
        <p>{hit.shortDesc}</p>
      </div>
    </InstantHitContainer>
  )
}

export function InstantTopicHit({ hit }: { hit: TopicRawHit }) {
  return (
    <InstantHitContainer>
      <Avatar>
        <IconIssue />
      </Avatar>
      <div>
        <h3>{hit.name}</h3>
        {/* TODO: use Snippet to truncate text and highlight keyword */}
        <p>{hit.shortDesc}</p>
      </div>
    </InstantHitContainer>
  )
}
