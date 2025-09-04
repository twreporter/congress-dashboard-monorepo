import React from 'react'
import styled from 'styled-components'
import type { Hit } from 'instantsearch.js'
import type { LayoutVariant } from '@/components/search/constants'
import { InternalRoutes } from '@/constants/routes'
import { Highlight, Snippet } from 'react-instantsearch'
import { Issue as IconIssue } from '@/components/search/icons'
import { layoutVariants } from '@/components/search/constants'
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'

export type LegislatorRawHit = Hit<{
  objectID: string
  slug: string
  name: string
  desc: string
  shortDesc: string
  imgSrc: string
  term: number
  lastSpeechAt?: string
  partyImgSrc: string
}>

export type TopicRawHit = Hit<{
  objectID: string
  name: string
  slug: string
  desc: string
  term: number
  session: number
  lastSpeechAt?: string
  relatedMessageCount: number
}>

const Circle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid ${colorGrayscale.gray200};
  background-color: ${colorGrayscale.white};
`

const TopicCircle = styled(Circle)`
  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
`

const Avatar = styled(Circle)<{ $imgSrc: string }>`
  ${({ $imgSrc }) => {
    return `background-image: url(${$imgSrc});`
  }}
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  position: relative;
`

const Party = styled(Circle)<{ $imgSrc: string }>`
  ${({ $imgSrc }) => {
    return `background-image: url(${$imgSrc});`
  }}
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  width: 16px;
  height: 16px;

  position: absolute;
  right: 0;
  bottom: 0;
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

const InstantHitContainer = styled.div<{ $variant: LayoutVariant }>`
  width: 100%;
  margin: 4px 0;
  ${({ $variant }) => {
    switch ($variant) {
      case layoutVariants.Modal: {
        return `
          padding: 8px 24px;
        `
      }
      default: {
        return `
          padding: 8px 16px;
        `
      }
    }
  }}

  display: flex;
  gap: 12px;
  align-items: center;

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

  ${Avatar}, ${TopicCircle} {
    flex-shrink: 0;
  }

  ${Text} {
    overflow: hidden;
  }
`

export function InstantLegislatorHit({
  hit,
  variant,
}: {
  hit: LegislatorRawHit
  variant: LayoutVariant
}) {
  return (
    <a
      href={`${InternalRoutes.Legislator}/${hit.slug}?meetingTerm=${hit.term}`}
    >
      <InstantHitContainer $variant={variant}>
        <Avatar $imgSrc={hit.imgSrc}>
          <Party $imgSrc={hit.partyImgSrc} />
        </Avatar>
        <Text>
          <Highlight highlightedTagName="span" attribute="name" hit={hit} />
          <p>{hit.shortDesc}</p>
        </Text>
      </InstantHitContainer>
    </a>
  )
}

export function InstantTopicHit({
  hit,
  variant,
}: {
  hit: TopicRawHit
  variant: LayoutVariant
}) {
  return (
    <a
      href={`${InternalRoutes.Topic}/${hit.slug}?meetingTerm=${hit.term}&sessionTerm=[${hit.session}]`}
    >
      <InstantHitContainer $variant={variant}>
        <TopicCircle>
          <IconIssue />
        </TopicCircle>
        <Text>
          <Highlight highlightedTagName="span" attribute="name" hit={hit} />
          <p>
            {variant === layoutVariants.Default ? (
              <span>共{hit.relatedMessageCount}筆發言：</span>
            ) : (
              <span>發言：</span>
            )}
            <Snippet highlightedTagName="span" attribute="desc" hit={hit} />
          </p>
        </Text>
      </InstantHitContainer>
    </a>
  )
}
