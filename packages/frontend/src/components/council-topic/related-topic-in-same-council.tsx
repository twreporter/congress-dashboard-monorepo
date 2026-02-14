'use client'
import { type FC, useMemo } from 'react'
import Link from 'next/link'
// components
import { H4Title } from '@/components/topic/styles'
import { Issue } from '@/components/sidebar/follow-more'
// constants
import { InternalRoutes } from '@/constants/routes'
// @twreporter
import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'
// types
import type { CouncilDistrict } from '@/types/council'
import type { RelatedTopic } from '@/types/council-topic'
// style
import {
  Container,
  TopicsContainer,
} from '@/components/topic/topic-others-watching'

type RelatedTopicInSameCouncilProps = {
  districtSlug: CouncilDistrict
  topics?: RelatedTopic[]
}

const RelatedTopicInSameCouncil: FC<RelatedTopicInSameCouncilProps> = ({
  districtSlug,
  topics = [],
}) => {
  const title = useMemo(
    () => `${CITY_LABEL[districtSlug]}議會其他議題`,
    [districtSlug]
  )

  if (topics.length === 0) {
    return null
  }

  return (
    <Container>
      <H4Title text={title} />
      <TopicsContainer>
        {topics.map((tag, index) => (
          <Link
            href={`${InternalRoutes.CouncilTopic(districtSlug)}/${tag.slug}`}
            key={`related-topic-in-same-council-${index}`}
          >
            <Issue name={`#${tag.title}`} slug={tag.slug} />
          </Link>
        ))}
      </TopicsContainer>
    </Container>
  )
}

export default RelatedTopicInSameCouncil
