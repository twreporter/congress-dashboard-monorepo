import React, { type FC } from 'react'
import styled from 'styled-components'
// types
import type { RelatedLink } from '@/types/councilor'
// components
import { P1Gray800 } from '@/components/legislator/styles'
import Tooltip from '@/components/dashboard/card/tooltip'
import TextButton from '@/components/button/text-button'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'

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
export const LinkList = styled.ul`
  list-style-position: inside;
  margin-top: 8px;
  ${mq.tabletAndBelow`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));  
  `}
`
export const LinkButton = styled(TextButton)`
  display: inline-flex;
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
          <li key={`related-link-${index}`}>
            <LinkButton
              text={label}
              onClick={() => window.open(url, '_blank')}
            />
          </li>
        ))}
      </LinkList>
    </Container>
  )
}

export default RelatedLinkBlock
