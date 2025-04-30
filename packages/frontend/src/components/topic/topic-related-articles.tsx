'use client'

import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
// fetcher
import useTwreporterArticle from '@/fetchers/twreporter-article'
// component
import { Triangle, Gap, ImageWithSkeleton } from '@/components/skeleton'
import { H4Title, P3Gray600, H6Gray800 } from '@/components/topic/styles'
// util
import { formatDate } from '@/utils/date-formatters'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import {
  DesktopAndAbove,
  MobileOnly,
} from '@twreporter/react-components/lib/rwd'
import mq from '@twreporter/core/lib/utils/media-query'

// horizontal line component
const HorizontalLine = styled.div`
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
const TabletOnly = styled.div`
  display: none;
  ${mq.tabletOnly`
    display: block;  
  `}
`
const imageStyle = {
  flex: 'none',
}

type TwreporterArticleProps = {
  slug: string
  onError?: () => void
}
const TwreporterArticle: React.FC<TwreporterArticleProps> = ({
  slug,
  onError,
}) => {
  const { data, isLoading, error } = useTwreporterArticle(slug)
  const hasCalledOnError = useRef(false)

  useEffect(() => {
    if (!isLoading && error && !hasCalledOnError.current) {
      hasCalledOnError.current = true
      onError?.()
    }
  }, [isLoading, error, onError])

  if (isLoading) {
    return (
      <ArticleBox>
        <FlexColumn>
          <CategoryAndDate>
            <Triangle $width={'36px'} $height={'18px'} />
            <Triangle $width={'60px'} $height={'18px'} />
          </CategoryAndDate>
          <Gap $gap={8} />
          <Triangle $width={'100%'} $height={'20px'} />
          <Gap $gap={4} />
          <DesktopAndAbove>
            <Triangle $width={'100%'} $height={'20px'} />
            <Gap $gap={4} />
            <Triangle $width={'80px'} $height={'20px'} />
          </DesktopAndAbove>
          <TabletOnly>
            <Triangle $width={'240px'} $height={'20px'} />
          </TabletOnly>
          <MobileOnly>
            <Triangle $width={'100%'} $height={'20px'} />
            <Gap $gap={4} />
            <Triangle $width={'80px'} $height={'20px'} />
          </MobileOnly>
        </FlexColumn>
        <Triangle $width={'72px'} $height={'72px'} />
      </ArticleBox>
    )
  }
  if (error || !data) {
    return null
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
            <P3Gray600
              text={`${formatDate(data.publishedDate, 'YYYY/MM/DD')}`}
            />
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

type TopicRelatedArticlesProps = {
  relatedArticles?: string[]
}
const TopicRelatedArticles: React.FC<TopicRelatedArticlesProps> = ({
  relatedArticles = [],
}) => {
  const [errorCount, setErrorCount] = useState(0)

  if (!relatedArticles || relatedArticles.length === 0) {
    return null
  }
  if (errorCount === relatedArticles.length) {
    return null
  }

  return (
    <RelatedArticleBlock>
      <H4Title text="相關文章" />
      {relatedArticles.map((slug, index) => (
        <div key={`twreporter-a-${slug}`}>
          {index !== 0 ? <HorizontalLine /> : null}
          <TwreporterArticle
            slug={slug}
            onError={() => setErrorCount((errorCount) => errorCount + 1)}
          />
        </div>
      ))}
    </RelatedArticleBlock>
  )
}

export default TopicRelatedArticles
