import React, { type FC } from 'react'
import styled from 'styled-components'
// types
import type { RelatedLink } from '@/types/councilor'
// components
import { P1Gray800 } from '@/components/legislator/styles'
import Tooltip from '@/components/dashboard/card/tooltip'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { TextButton } from '@twreporter/react-components/lib/button'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 8px;
  background-color: ${colorGrayscale.white};
  ${mq.tabletAndBelow`
    width: 100%;
  `}
`
const Title = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`
const LinkList = styled.ul`
  list-style: none;
  margin-top: 8px;
  ${mq.tabletAndBelow`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));  
  `}
`
const LinkItem = styled.li``
const LinkButton = styled(TextButton)`
  &::before {
    content: '•';
    margin-right: 4px;
    color: ${colorGrayscale.gray800};
    font-size: 16px;
  }
`

type RelatedLinkProps = {
  relatedLink: RelatedLink[]
}
const RelatedLinkBlock: FC<RelatedLinkProps> = ({ relatedLink }) => {
  if (!relatedLink || relatedLink.length === 0) return null

  return (
    <Container>
      <Title>
        <P1Gray800 text="相關經歷" />
        <Tooltip tooltip="僅顯示資料庫內之資料，非完整經歷" />
      </Title>
      <LinkList>
        {relatedLink.map(({ url, label }, index) => (
          <LinkItem key={`related-link-${index}`}>
            <LinkButton
              text={label}
              onClick={() => window.open(url, '_blank')}
            />
          </LinkItem>
        ))}
      </LinkList>
    </Container>
  )
}

export default RelatedLinkBlock
