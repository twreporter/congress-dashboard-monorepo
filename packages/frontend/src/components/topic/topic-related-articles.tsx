'use client'

import React from 'react'
import styled from 'styled-components'
// fetcher
import useTwreporterArticle from '@/fetchers/twreporter-article'
// component
import { Triangle } from '@/components/skeleton'
// util
import { formatDateToYYYYMMDD } from '@/utils/date-formatters'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// components
import { H4Title, P3Gray600, H6Gray800 } from '@/components/topic/styles'
import { ImageWithSkeleton } from '@/components/skeleton'

// horizontal line component
const HorazontalLine = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid ${colorGrayscale.gray300};
`

// TwreporterArticle component
const ArticleBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`
const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const CategoryAndDate = styled.div`
  display: flex;
  gap: 8px;
`
const imageStyle = {
  flex: 'none',
}

type TwreporterArticleProps = {
  slug: string
}
const TwreporterArticle: React.FC<TwreporterArticleProps> = ({ slug }) => {
  const { data, isLoading, error } = useTwreporterArticle(slug)
  if (isLoading || error) {
    return (
      <ArticleBox>
        <Triangle $width={'250px'} $height={'120px'} />
      </ArticleBox>
    )
  }

  const openTwreporterArticle = () => {
    if (data?.url) {
      window.open(data.url, '_blank')
    }
  }

  return (
    <ArticleBox onClick={openTwreporterArticle}>
      <FlexColumn>
        <CategoryAndDate>
          <P3Gray600 text={data?.category} />
          {data?.publishedDate ? (
            <P3Gray600 text={`${formatDateToYYYYMMDD(data.publishedDate)}`} />
          ) : null}
        </CategoryAndDate>
        <H6Gray800 text={data?.title} />
      </FlexColumn>
      {data?.image?.url ? (
        <ImageWithSkeleton
          src={data.image?.url}
          alt={
            data?.image?.description || `image of twreporter article ${slug}`
          }
          width={72}
          height={72}
          style={imageStyle}
        />
      ) : (
        <Triangle $width={'72px'} $height={'72px'} />
      )}
    </ArticleBox>
  )
}

// RelatedArticle component
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
  relatedArticles?: string[]
}
const TopicRelatedArticles: React.FC<TopicRelatedArticlesProps> = ({
  relatedArticles = [],
}) => {
  if (relatedArticles.length === 0) {
    return null
  }

  return (
    <RelatedArticleBlock>
      <H4Title text="相關文章" />
      {relatedArticles.map((slug, index) => (
        <div key={`twreporter-a-${slug}`}>
          {index !== 0 ? <HorazontalLine /> : null}
          <TwreporterArticle slug={slug} />
        </div>
      ))}
    </RelatedArticleBlock>
  )
}

export default TopicRelatedArticles
