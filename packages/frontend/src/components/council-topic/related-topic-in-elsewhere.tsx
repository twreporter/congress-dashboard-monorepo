'use client'
import { type FC } from 'react'
import Link from 'next/link'
// components
import { H4Title } from '@/components/topic/styles'
import { LinkList, LinkButton } from '@/components/councilor/related-link'
import { Container } from '@/components/topic/topic-others-watching'
// constants
import { InternalRoutes } from '@/constants/routes'
// @twreporter
import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'
// types
import type {
  RelatedTopic,
  RelatedTopicInOtherCity,
} from '@/types/council-topic'

type RelatedTopicInElsewhereProps = {
  relatedLegislativeTopic?: RelatedTopic[]
  relatedCouncilTopic?: RelatedTopicInOtherCity[]
}

const RelatedTopicInElsewhere: FC<RelatedTopicInElsewhereProps> = ({
  relatedLegislativeTopic = [],
  relatedCouncilTopic = [],
}) => {
  if (
    relatedLegislativeTopic.length === 0 &&
    relatedCouncilTopic.length === 0
  ) {
    return null
  }

  return (
    <Container>
      <H4Title text="其他單位相關討論" />
      <LinkList>
        {relatedLegislativeTopic.map(({ slug, title }, index) => (
          <li key={`related-topic-in-legislative-yuan-${index}`}>
            <Link href={`${InternalRoutes.Topic}/${slug}`}>
              <LinkButton text={`立法院-${title}`} />
            </Link>
          </li>
        ))}
        {relatedCouncilTopic.map(({ slug, title, city }, index) => (
          <li key={`related-topic-in-other-${city}-council-${index}`}>
            <Link
              href={`${InternalRoutes.Council}/${city}${InternalRoutes.CouncilTopic}/${slug}`}
            >
              <LinkButton text={`${CITY_LABEL[city]}議會-${title}`} />
            </Link>
          </li>
        ))}
      </LinkList>
    </Container>
  )
}

export default RelatedTopicInElsewhere
