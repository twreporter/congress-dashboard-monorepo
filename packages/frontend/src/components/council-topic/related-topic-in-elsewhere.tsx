'use client'
import { type FC, useState, useMemo } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
// components
import { H4Title } from '@/components/topic/styles'
import { LinkList, LinkButton } from '@/components/layout/related-link-block'
import { Container } from '@/components/topic/topic-others-watching'
import { LinkText } from '@/components/sidebar/card'
// constants
import { InternalRoutes } from '@/constants/routes'
// @twreporter
import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'
import mq from '@twreporter/core/lib/utils/media-query'
// types
import type {
  RelatedTopic,
  RelatedTopicInOtherCity,
} from '@/types/council-topic'

const LinkBlock = styled(LinkList)<{ $showAll: boolean }>`
  margin-top: 0 !important;
  ${mq.mobileOnly`
    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;  
  `}

  a {
    text-decoration: none;
  }

  ${(props) =>
    props.$showAll
      ? ''
      : `
    li:last-child p {
      -webkit-mask-image: linear-gradient(
        to bottom,
        black 0%,
        black 0%,
        transparent 100%
      );
      mask-image: linear-gradient(
        to bottom,
        black 0%,
        black 0%,
        transparent 100%
      );
    }
  `}
`
const More = styled.div<{ $showAll: boolean }>`
  display: ${(props) => (props.$showAll ? 'none' : 'flex')};
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

type RelatedItem = {
  text: string
  url: string
}

type RelatedTopicInElsewhereProps = {
  relatedLegislativeTopic?: RelatedTopic[]
  relatedCouncilTopic?: RelatedTopicInOtherCity[]
}

const DEFAULT_ITEM_NUMBER = 3

const RelatedTopicInElsewhere: FC<RelatedTopicInElsewhereProps> = ({
  relatedLegislativeTopic = [],
  relatedCouncilTopic = [],
}) => {
  const [showAll, setShowAll] = useState<boolean>(
    relatedLegislativeTopic.length + relatedCouncilTopic.length <
      DEFAULT_ITEM_NUMBER
  )
  const relatedItems = useMemo<RelatedItem[]>(() => {
    return relatedLegislativeTopic
      .map(({ slug, title }) => ({
        text: `立法院-${title}`,
        url: `${InternalRoutes.Topic}/${slug}`,
      }))
      .concat(
        relatedCouncilTopic.map(({ slug, title, city }) => ({
          text: `${CITY_LABEL[city]}議會-${title}`,
          url: `${InternalRoutes.CouncilTopic(city)}/${slug}`,
        }))
      )
  }, [relatedLegislativeTopic, relatedCouncilTopic])
  const relatedItemsForShow = useMemo<RelatedItem[]>(
    () => (showAll ? relatedItems : relatedItems.slice(0, DEFAULT_ITEM_NUMBER)),
    [relatedItems, showAll]
  )

  if (
    relatedLegislativeTopic.length === 0 &&
    relatedCouncilTopic.length === 0
  ) {
    return null
  }

  return (
    <Container>
      <H4Title text="其他單位相關討論" />
      <LinkBlock $showAll={showAll}>
        {relatedItemsForShow.map(({ text, url }, index) => (
          <li key={`related-topic-elsewhere-${index}`}>
            <Link href={url}>
              <LinkButton text={text} />
            </Link>
          </li>
        ))}
      </LinkBlock>
      <More $showAll={showAll} onClick={() => setShowAll(true)}>
        <LinkText>顯示全部</LinkText>
      </More>
    </Container>
  )
}

export default RelatedTopicInElsewhere
