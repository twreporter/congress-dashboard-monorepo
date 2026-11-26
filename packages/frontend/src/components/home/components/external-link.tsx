'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import { H5 } from '@twreporter/react-components/lib/text/headline'
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { OpenInNew } from '@twreporter/react-components/lib/icon'

const StyledLink = styled.a`
  display: flex;
  padding: 12px 12px 12px 16px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-direction: row;
  border-radius: 4px;
  border: 1px solid ${colorOpacity['black_0.1']};
  cursor: pointer;
  text-decoration: none;
  &:hover {
    border: 1px solid ${colorOpacity['black_0.2']};
  }
  &:hover > svg {
    background-color: ${colorGrayscale.gray800} !important;
  }
`

const TitleAndDescription = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled(H5)`
  color: ${colorGrayscale.gray900};
`
const Description = styled(P2)`
  color: ${colorGrayscale.gray800};
`

const Icon = styled(OpenInNew)`
  background-color: ${colorGrayscale.gray600} !important;
`

type ExternalLinkProps = {
  href: string
  title: string
  description: string
}

const ExternalLink: FC<ExternalLinkProps> = ({ href, title, description }) => {
  return (
    <StyledLink href={href} target="_blank" rel="noopener noreferrer">
      <TitleAndDescription>
        <Title text={title} />
        <Description text={description} />
      </TitleAndDescription>
      <Icon />
    </StyledLink>
  )
}

export default ExternalLink
