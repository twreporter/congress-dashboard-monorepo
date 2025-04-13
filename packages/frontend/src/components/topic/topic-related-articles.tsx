'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// components
import { H4Title, P3Gray600 } from '@/components/topic/styles'

const RelatedArticleBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 20px;
  border-radius: 8px;
  background-color: ${colorGrayscale.white};
  ${mq.tabletOnly`
    margin-left: -32px;
    margin-right: -32px;
    padding-left: 32px;
    padding-right: 32px;
  `}
  ${mq.mobileOnly`
    margin-left: -24px;
    margin-right: -24px;
    padding-left: 24px;
    padding-right: 24px;
  `}
`
// TODO: add related articles
type TopicRelatedArticlesProps = {
  relatedArticles?: {
    slug: string
    title: string
  }[]
}
const TopicRelatedArticles: React.FC<TopicRelatedArticlesProps> = ({
  relatedArticles = [],
}) => {
  return relatedArticles.length > 0 ? (
    <RelatedArticleBlock>
      <H4Title text="相關文章" />
      {relatedArticles.map((article) => (
        <P3Gray600 key={article.slug} text={article.title} />
      ))}
    </RelatedArticleBlock>
  ) : null
}

export default TopicRelatedArticles
