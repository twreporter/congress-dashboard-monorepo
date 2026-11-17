'use client'
import React, { type FC } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
// @twreporter
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import { H5 } from '@twreporter/react-components/lib/text/headline'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'

const StyledLink = styled(Link)`
  display: flex;
  padding: 12px 16px;
  flex-direction: column;
  border-radius: 4px;
  background: rgba(241, 241, 241, 0.5);
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background: ${colorGrayscale.gray100};
  }
`

const Title = styled(H5)`
  color: ${colorGrayscale.gray900};
`
const Description = styled(P2)`
  color: ${colorGrayscale.gray800};
`

type InternalLinkProps = {
  href: string
  title: string
  description: string
}

const InternalLink: FC<InternalLinkProps> = ({ href, title, description }) => {
  return (
    <StyledLink href={href}>
      <Title text={title} />
      <Description text={description} />
    </StyledLink>
  )
}

export default InternalLink
